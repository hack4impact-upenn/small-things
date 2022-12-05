/**
 * All the functions for interacting with user data in the MongoDB database
 */
import { hash } from 'bcrypt';
import { ISettings, Settings } from '../models/settings.model';
import { User } from '../models/user.model';

const passwordHashSaltRounds = 10;
const removeSensitiveDataQuery = [
  '-password',
  '-verificationToken',
  '-resetPasswordToken',
  '-resetPasswordTokenExpiryDate',
];

const removeSensitiveDataQueryKeepPassword = [
  '-verificationToken',
  '-resetPasswordToken',
  '-resetPasswordTokenExpiryDate',
];

/**
 * Creates a new user in the database.
 * @param firstName - string representing the first name of the user
 * @param lastName - string representing the last name of the user
 * @param email - string representing the email of the user
 * @param password - string representing the password of the user
 * @returns The created {@link User}
 */
const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  organization: string,
) => {
  const hashedPassword = await hash(password, passwordHashSaltRounds);
  if (!hashedPassword) {
    return null;
  }
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    admin: false,
    organization,
    enabled: true,
  });
  const user = await newUser.save();
  return user;
};

/**
 * Gets a user from the database by their email but doesn't include the
 * password in the returned user.
 * @param email The email of the user to get
 * @returns The {@link User} or null if the user was not found.
 */
const getUserByEmail = async (email: string) => {
  const user = await User.findOne({ email })
    .select(removeSensitiveDataQuery)
    .exec();
  return user;
};

/**
 * Gets a user from the database by their email and includes the password in
 * the returned user.
 * @param email The email of the user to get
 * @returns The {@link User} or null if the user was not found.
 */
const getUserByEmailWithPassword = async (email: string) => {
  const user = await User.findOne({ email })
    .select(removeSensitiveDataQueryKeepPassword)
    .exec();
  return user;
};

/**
 * Gets a user from the database by their verification token but doesn't include
 * the password in the returned user.
 * @param verificationToken The {@link string} representing the verification token
 * @returns The {@link User} or null if the user was not found.
 */
const getUserByVerificationToken = async (verificationToken: string) => {
  const user = await User.findOne({ verificationToken })
    .select(removeSensitiveDataQuery)
    .exec();
  return user;
};

/**
 * Gets a user from the database by their id but doesn't include the
 * password in the returned user.
 * @param id The id of the user to get.
 * @returns The {@link User} or null if the user was not found.
 */
const getUserById = async (id: string) => {
  const user = await User.findById(id).select(removeSensitiveDataQuery).exec();
  return user;
};

/**
 * Gets a user from the database by their reset password token if the token
 * is not expired.
 * @param verificationToken The {@link string} representing the verification token
 * @returns The {@link User} or null if such a user was not found.
 */
const getUserByResetPasswordToken = async (resetPasswordToken: string) => {
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordTokenExpiryDate: { $gt: Date.now() },
  }).exec();
  return user;
};

/**
 * @returns All the {@link User}s in the database without their passwords.
 */
const getAllUsersFromDB = async () => {
  const userList = await User.find({}).select(removeSensitiveDataQuery).exec();
  return userList;
};

/**
 * A function that upgrades a certain user to an admin.
 * @param id The id of the user to upgrade.
 * @returns The upgraded {@link User}
 */
const upgradeUserToAdmin = async (id: string) => {
  const user = await User.findByIdAndUpdate(id, [
    { $set: { admin: { $eq: [false, '$admin'] } } },
  ]).exec();
  return user;
};

const getUserByOrganization = async (organization: string) => {
  const user = await User.findOne({ organization })
    .select(removeSensitiveDataQuery)
    .exec();
  return user;
};

/**
 * A function that deletes a user from the database.
 * @param id The id of the user to delete.
 * @returns The deleted {@link User}
 */
const deleteUserById = async (id: string) => {
  const user = await User.findByIdAndDelete(id).exec();
  return user;
};

/**
 * A function that updates a user's status.
 * @param id The id of the user to update.
 * @param status The new status.
 * @returns The updated {@link User}
 */

const updateUserById = async (id: string, status: boolean) => {
  const user = await User.findByIdAndUpdate(id, [
    { $set: { enabled: { $eq: [status, '$enabled'] } } },
  ]).exec();
  return user;
  /**
   * A function that updates a user's status.
   * @param newSettings The new settings.
   * @returns status code.
   */
};

const updateSettingsInDB = async (newSettings: ISettings) => {
  const settings = await Settings.findOneAndUpdate({}, newSettings).exec();
  return settings;
};

/**
 * A function that gets the settings
 * @returns The updated {@link Settings}
 */
const getSettingsFromDB = async () => {
  const settings = await Settings.findOne({}).exec();
  return settings;
};

export {
  passwordHashSaltRounds,
  createUser,
  getUserByEmail,
  getUserByVerificationToken,
  getUserById,
  getUserByEmailWithPassword,
  getUserByResetPasswordToken,
  getAllUsersFromDB,
  upgradeUserToAdmin,
  deleteUserById,
  updateSettingsInDB,
  updateUserById,
  getUserByOrganization,
  getSettingsFromDB,
};

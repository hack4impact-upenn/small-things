import { Invite } from '../models/invite.model';

const removeSensitiveDataQuery = ['-verificationToken'];

/**
 * Creates a new invite in the database.
 * @param email - string representing the email of the invited user
 * @param verificationToken - string representing verification token
 * @returns The created {@link Invite}
 */
const createInvite = async (email: string, verificationToken: string) => {
  const newInvite = new Invite({
    email,
    verificationToken,
  });
  const invite = await newInvite.save();
  return invite;
};

const getInviteByEmail = async (email: string) => {
  const invite = await Invite.findOne({ email })
    .select(removeSensitiveDataQuery)
    .exec();
  return invite;
};

const getInviteByToken = async (token: string) => {
  const invite = await Invite.findOne({ verificationToken: token }).exec();
  return invite;
};

export { createInvite, getInviteByEmail, getInviteByToken };

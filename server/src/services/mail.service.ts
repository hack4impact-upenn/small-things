/**
 * All the functions related to sending emails with SendGrid
 */
import 'dotenv/config';
import SGmail, { MailDataRequired } from '@sendgrid/mail';
import { IOrder, retailRescueItem } from '../models/order.model';

const appName = 'Small Things'; // Replace with a relevant project name
const senderName = 'Small Things'; // Replace with a relevant project sender
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.PUBLIC_URL
    : 'http://localhost:3000'; // TODO: figure out better place to put this

// eslint-disable-next-line no-useless-concat
SGmail.setApiKey(`${process.env.SENDGRID_API_KEY}`);

/**
 * Sends a reset password link to a user
 * @param email The email of the user to send the link to
 * @param token The unique token identifying this reset attempt for the user
 */
const emailResetPasswordLink = async (email: string, token: string) => {
  // TODO DURING DEVELOPMENT: use a template to make this prettier and match client's style
  const resetLink = `${baseUrl}/reset-password/${token}`;
  const mailSettings: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: email,
    subject: 'Link to Reset Password',
    html:
      `<p>You are receiving this because you (or someone else) have requested ` +
      `the reset of your account password for ${appName}. Please visit this ` +
      `<a href=${resetLink}>link</a> ` +
      `within an hour of receiving this email to successfully reset your password </p>` +
      `<p>If you did not request this change, please ignore this email and your ` +
      `account will remain secured.</p>`,
  };

  // Send the email and propogate the error up if one exists
  await SGmail.send(mailSettings);
};

/**
 * Sends an email to verify an email account
 * @param email The email of the user to send the link to
 * @param token The unique token identifying this verification attempt
 */
const emailVerificationLink = async (email: string, token: string) => {
  const resetLink = `${baseUrl}/verify-account/${token}`;
  const mailSettings: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: email,
    subject: 'Verify account',
    html:
      `<p> Please visit the following ` +
      `<a href=${resetLink}>link</a> ` +
      `to verify your account for ${appName} and complete registration</p>` +
      `<p>If you did not attempt to register an account with this email address, ` +
      `please ignore this message.</p>`,
  };
  // Send the email and propogate the error up if one exists
  await SGmail.send(mailSettings);
};

const emailInviteLink = async (email: string, token: string) => {
  const resetLink = `${baseUrl}/invite/${token}`;
  const mailSettings: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: email,
    subject: 'Verify account',
    html:
      `<p> Please visit the following ` +
      `<a href=${resetLink}>link</a> ` +
      `to create your account for ${appName} and complete registration</p>` +
      `<p>If you did not attempt to register an account with this email address, ` +
      `please ignore this message.</p>`,
  };
  // Send the email and propogate the error up if one exists
  await SGmail.send(mailSettings);
};

const parseArray = (array: any) => {
  return array
    .map((element: retailRescueItem) => `${element.item} ${element.comment}`)
    .join();
};

const formatOrderToEmail = (order: IOrder) => {
  const pickupDate = new Date(order.pickup);
  if (order.advanced) {
    return (
      `<h1>Your order has been approved</h1>` +
      `<h2>Your order summary:</h2>` +
      `<div>Organization: ${order.organization}</div>` +
      `<div>Produce: ${order.produce}</div>` +
      `<div>Meat: ${parseArray(order.meat)}</div>` +
      `<div>Vito: ${parseArray(order.vito)}</div>` +
      `<div>Dry: ${parseArray(order.dry)}</div>` +
      `<div>Retail Rescue: ${parseArray(order.retailRescue)}</div>` +
      `<div>Status: ${order.status}</div>` +
      `<div>Pickup: ${pickupDate.toLocaleString()}</div>`
    );
  }
  return (
    `<h1>Your order has been approved</h1>` +
    `<h2>Your order summary:</h2>` +
    `<div>Organization: ${order.organization}</div>` +
    `<div>Produce: ${order.produce}</div>` +
    `<div>Meat: ${order.meat}</div>` +
    `<div>Vito: ${order.vito}</div>` +
    `<div>Dry: ${order.dry}</div>` +
    `<div>Retail Rescue: ${parseArray(order.retailRescue)}</div>` +
    `<div>Status: ${order.status}</div>` +
    `<div>Pickup: ${pickupDate.toLocaleString()}</div>`
  );
};

const emailApproveOrder = async (email: string, order: IOrder) => {
  const mailSettings: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: email,
    subject: 'Order Approval',
    html:
      `<h1>Your order has been Approved</h1>` +
      `<h2>Your order summary:</h2>${formatOrderToEmail(order)}`,
  };
  // Send the email and propogate the error up if one exists
  await SGmail.send(mailSettings);
};

const emailRejectOrder = async (email: string, order: IOrder) => {
  const mailSettings: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: email,
    subject: 'Order Rejection',
    html:
      `<h1>Your order has been rejected</h1>` +
      `<h2>Your order summary:</h2>${formatOrderToEmail(order)}`,
  };
  // Send the email and propogate the error up if one exists
  await SGmail.send(mailSettings);
};

export {
  emailVerificationLink,
  emailResetPasswordLink,
  emailInviteLink,
  emailApproveOrder,
  emailRejectOrder,
};

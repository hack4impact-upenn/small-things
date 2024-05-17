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
      `to verify your account for ${appName} and complete registration.</p>` +
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
      `to create your account for ${appName} and complete registration.</p>` +
      `<p>If you did not attempt to register an account with this email address, ` +
      `please ignore this message.</p>`,
  };
  // Send the email and propogate the error up if one exists
  await SGmail.send(mailSettings);
};

const parseArray = (array: any) => {
  return array
    .map(
      (element: retailRescueItem) =>
        `Item: ${element.item} - Comment: ${
          element.comment === undefined || element.comment.length === 0
            ? 'None'
            : element.comment
        }`,
    )
    .join(', ');
};

const formatOrderToEmail = (order: IOrder) => {
  const pickupDate = new Date(order.pickup);
  if (order.advanced) {
    return (
      `<div style="color:black;">Organization: ${order.organization}</div>` +
      `<div style="color:black;">Produce: ${order.produce}</div>` +
      `<div style="color:black;">Meat: ${parseArray(order.meat)}</div>` +
      `<div style="color:black;">Vito: ${parseArray(order.vito)}</div>` +
      `<div style="color:black;">Dry: ${parseArray(order.dry)}</div>` +
      `<div style="color:black;"> Retail Rescue: ${parseArray(
        order.retailRescue,
      )}</div>` +
      `<div style="color:black;">Status: ${order.status}</div>` +
      `<div style="color:black;">Pickup: ${pickupDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}</div>`
    );
  }
  return (
    `<div style="color:black;">Organization: ${order.organization}</div>` +
    `<div style="color:black;">Produce: ${order.produce}</div>` +
    `<div style="color:black;">Meat: ${order.meat}</div>` +
    `<div style="color:black;">Vito: ${order.vito}</div>` +
    `<div style="color:black;">Dry: ${order.dry}</div>` +
    `<div style="color:black;">Retail Rescue: ${parseArray(
      order.retailRescue,
    )}</div>` +
    `<div style="color:black;">Status: ${order.status}</div>` +
    `<div style="color:black;">Pickup Date: ${pickupDate.toDateString()}</div>` +
    `<div style="color:black;">Pickup Time: ${pickupDate.toLocaleTimeString(
      [],
      {
        hour: '2-digit',
        minute: '2-digit',
      },
    )}</div>`
  );
};

const emailModifyApproveOrder = async (email: string, order: IOrder) => {
  const userEmail: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: order.email,
    subject: 'Order Modified/Approved',
    html:
      `<h1 style="color:black;">Your order has been modified and approved</h1>` +
      `<h2 style="color:black;">Your order summary:</h2>${formatOrderToEmail(
        order,
      )}`,
  };
  const adminEmail: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: email,
    subject: 'Modified/Approved Order',
    html:
      `<h1 style="color:black;">You modified/approved an order</h1>` +
      `<h2 style="color:black;">Order summary:</h2>${formatOrderToEmail(
        order,
      )}`,
  };
  // Send the email and propogate the error up if one exists
  await SGmail.send(userEmail);
  await SGmail.send(adminEmail);
};

const emailModifyOrder = async (email: string, order: IOrder) => {
  const userEmail: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: order.email,
    subject: 'Order Modified',
    html:
      `<h1 style="color:black;">You have modified your order</h1>` +
      `<h2 style="color:black;">Your order summary:</h2>${formatOrderToEmail(
        order,
      )}`,
  };
  // Send the email and propogate the error up if one exists
  await SGmail.send(userEmail);
};

const emailApproveOrder = async (email: string, order: IOrder) => {
  const userEmail: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: order.email,
    subject: 'Order Approval',
    html:
      `<h1 style="color:black;">Your order has been approved</h1>` +
      `<h2 style="color:black;">Your order summary:</h2>${formatOrderToEmail(
        order,
      )}`,
  };
  const adminEmail: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: email,
    subject: 'Approved Order',
    html:
      `<h1 style="color:black;">You approved an order</h1>` +
      `<h2 style="color:black;">Order summary:</h2>${formatOrderToEmail(
        order,
      )}`,
  };
  // Send the email and propogate the error up if one exists
  await SGmail.send(userEmail);
  await SGmail.send(adminEmail);
};

const emailRejectOrder = async (email: string, order: IOrder) => {
  const userEmail: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: order.email,
    subject: 'Order Rejection',
    html:
      `<h1 style="color:black;">Your order has been rejected</h1>` +
      `<h2 style="color:black;">Your order summary:</h2>${formatOrderToEmail(
        order,
      )}`,
  };

  const adminEmail: MailDataRequired = {
    from: {
      email: process.env.SENDGRID_EMAIL_ADDRESS || 'missing@mail.com',
      name: senderName,
    },
    to: email,
    subject: 'Rejected Order',
    html:
      `<h1 style="color:black;">You rejected an order</h1>` +
      `<h2 style="color:black;">Order summary:</h2>${formatOrderToEmail(
        order,
      )}`,
  };
  // Send the email and propogate the error up if one exists
  await SGmail.send(userEmail);
  await SGmail.send(adminEmail);
};

export {
  emailVerificationLink,
  emailResetPasswordLink,
  emailInviteLink,
  emailApproveOrder,
  emailRejectOrder,
  emailModifyApproveOrder,
  emailModifyOrder,
};

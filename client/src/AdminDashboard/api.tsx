/**
 * A file containing all the api calls for the admin dashboard.
 */
import { deleteData, putData, postData } from '../util/api';

/**
 * Sends a request to the server to delete a user
 * @param email - the email of the user to delete
 * @returns true if successful, false otherwise
 */
async function deleteUser(email: string) {
  const res = await deleteData(`admin/${email}`);
  if (res.error) return false;
  return true;
}
/**
 * Sends a request to the server to promote a user to admin
 * @param email - the email of the user to promote
 * @returns true if successful, false otherwise
 */
async function upgradePrivilege(email: string) {
  const res = await putData('admin/promote', { email });
  if (res.error) return false;
  return true;
}

async function downgradePrivilege(email: string) {
  const res = await putData('admin/demote', { email });
  if (res.error) return false;
  return true;
}

function createInvite(email: string) {
  return postData('admin/invite', { email });
}

export { deleteUser, upgradePrivilege, downgradePrivilege, createInvite };

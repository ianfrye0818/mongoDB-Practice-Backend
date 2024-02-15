import User from '../models/userModel';

export async function checkExistingUser(email: string) {
  const user = await User.findOne({ email });
  return user;
}
export async function checkExisitingUsername(username: string) {
  const user = await User.findOne({ username });
  return user;
}

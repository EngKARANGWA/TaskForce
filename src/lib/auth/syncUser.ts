import { findUserByEmail, addUser } from "../queries/users";

export const syncUser = async (kindeUser: any) => {
  if (!kindeUser) {
    throw new Error("No user data provided.");
  }

  const { id, given_name: firstName, family_name: lastName, email, username } =
    kindeUser;

  // Check if user exists in the database
  const existingUser = await findUserByEmail(email);

  if (existingUser.length > 0) {
    console.log(`User with email ${email} already exists.`);
    return existingUser[0];
  }

  // Add user to the database if not found
  const newUser = await addUser({
    id,
    firstName,
    lastName,
    email,
    username,
  });

  console.log(`User with email ${email} added successfully.`);
  return newUser;
};

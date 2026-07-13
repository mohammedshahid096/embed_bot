import bcrypt from "bcrypt";

/**
 * Hashes a plain text password using bcrypt
 * @param {string} password - Password to hash
 * @returns {Promise<string>} - Hashed password
 */
export const hashPasswordMethod = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

/**
 * Verifies the user password against a hashed password
 * @param {string} password - User's plain text password
 * @param {string} hashPassword - Hashed password stored in the database
 * @returns {Promise<boolean>} - Returns true if passwords match, otherwise false
 */
export const verifyPasswordMethod = async (
  password: string,
  hashPassword: string,
): Promise<boolean> => {
  const response: boolean = await bcrypt.compare(password, hashPassword);
  return response;
};

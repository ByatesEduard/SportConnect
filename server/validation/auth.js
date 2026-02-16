import User from '../models/User.js';


export const validationEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isUsernameUsed = async (username) => {
  const user = await User.findOne({ username });
  return !!user;
};


export const isEmailUsed = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};

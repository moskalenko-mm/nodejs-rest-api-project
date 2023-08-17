import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";

import { HttpError, resizeAvatar, sendEmail } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/user.js";
import { nanoid } from "nanoid";

const { JWT_SECRET } = process.env;
const avatarPath = path.resolve("public", "avatars");

const singup = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, { s: 250 });
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verification email",
    html: `<a href="http://localhost:3000/users/verify/${verificationToken}" target="_blank">Click to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
      avatarURL: newUser.avatarURL,
    },
  });
};

const singin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findOneAndUpdate(user._id, { token });

  res.json({
    token: token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).send();
};

const updateUserSubscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id } = req.user;
  const result = await User.findByIdAndUpdate(
    _id,
    { subscription },
    {
      new: true,
      select: "email subscription",
    }
  );

  res.json(result);
};

const updateAvatar = async (req, res) => {
  const { path: oldPath, filename } = req.file;
  const { _id } = req.user;
  await resizeAvatar(oldPath);
  const uniqFilename = `${_id}-${filename}`;
  const newPath = path.join(avatarPath, uniqFilename);
  await fs.rename(oldPath, newPath);
  const avatarURL = path.join("avatars", uniqFilename);

  await User.findByIdAndUpdate(
    _id,
    { avatarURL },
    {
      new: true,
      select: "avatarURL",
    }
  );

  res.json({ avatarURL });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  const result = await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({ message: "Verification successful" });
};

const resendVerificationToken = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = {
    to: email,
    subject: "Verification email",
    html: `<a href="http://localhost:3000/users/verify/${user.verificationToken}" target="_blank">Click to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

export default {
  singup: ctrlWrapper(singup),
  singin: ctrlWrapper(singin),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
  updateAvatar: ctrlWrapper(updateAvatar),
  verify: ctrlWrapper(verify),
  resendVerificationToken: ctrlWrapper(resendVerificationToken),
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import User from "../models/user.js";

const { JWT_SECRET } = process.env;

const singup = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const singin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
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

export default {
  singup: ctrlWrapper(singup),
  singin: ctrlWrapper(singin),
  logout: ctrlWrapper(logout),
  getCurrent: ctrlWrapper(getCurrent),
  updateUserSubscription: ctrlWrapper(updateUserSubscription),
};

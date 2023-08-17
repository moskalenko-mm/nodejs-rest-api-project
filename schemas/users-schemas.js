import Joi from "joi";
const userSingupSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": `missing required email field`,
  }),
  password: Joi.string().required().messages({
    "any.required": `missing required password field`,
  }),
});

const userSinginSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": `missing required email field`,
  }),
  password: Joi.string().required().messages({
    "any.required": `missing required password field`,
  }),
});

const userEmailSchema = Joi.object({
  email: Joi.string().required().email().messages({
    "any.required": `missing required email field`,
  }),
});

export default {
  userSingupSchema,
  userSinginSchema,
  userEmailSchema,
};

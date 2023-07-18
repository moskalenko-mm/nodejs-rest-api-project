import Joi from "joi";
const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `missing required name field`,
  }),
  email: Joi.string().required().email().messages({
    "any.required": `missing required email field`,
  }),
  phone: Joi.string()
    .required()
    .pattern(
      /^\+?\d{1,4}[-.\s]?\d{1,3}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
    )
    .messages({
      "any.required": `missing required phone field`,
    }),
});

export default {
  contactAddSchema,
};

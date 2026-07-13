import { celebrate, Joi } from "celebrate";

export const sendRegisterVerificationLinkValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(3).max(50).required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\#^()_\-+=])[A-Za-z\d@$!%*?&\#^()_\-+=]{8,}$/,
      )
      .required()
      .label("Password")
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 128 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
  }).required(),
});

export const verifyRegisterVerificationLinkValidation = celebrate({
  query: Joi.object({
    token: Joi.string().required().label("Token"),
  }).required(),
});

export const loginAuthValidation = celebrate({
  body: Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string()
      .min(8)
      .max(128)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\#^()_\-+=])[A-Za-z\d@$!%*?&\#^()_\-+=]{8,}$/,
      )
      .required()
      .label("Password")
      .messages({
        "string.min": "Password must be at least 8 characters long",
        "string.max": "Password must not exceed 128 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
  }).required(),
});

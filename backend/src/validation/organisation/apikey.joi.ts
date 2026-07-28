import { celebrate, Joi } from "celebrate";

export const addOrganisationApiKeyValidation = celebrate({
  body: Joi.object({
    gemini: Joi.string().min(3).required().label("Gemini"),
    openrouter: Joi.string().min(3).required().label("Open Router"),
  }).required(),
});

export const updateSingleApiKeyValidation = celebrate({
  params: Joi.object({
    provider: Joi.string()
      .valid("gemini", "openrouter")
      .required()
      .label("Provider"),
  }),
  body: Joi.object({
    apiKey: Joi.string().min(3).required().label("API Key"),
  }).required(),
});


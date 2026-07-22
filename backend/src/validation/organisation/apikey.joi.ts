import { celebrate, Joi } from "celebrate";

export const addOrganisationApiKeyValidation = celebrate({
  body: Joi.object({
    gemini: Joi.string().min(3).required().label("Gemini"),
    openrouter: Joi.string().min(3).required().label("Open Router"),
  }).required(),
});

import { celebrate, Joi } from "celebrate";

export const onBoardingOrganisationValidation = celebrate({
  body: Joi.object({
    name: Joi.string().min(3).max(50).required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    address: Joi.object({
      street: Joi.string().min(3).max(50).required().label("Street"),
      city: Joi.string().min(3).max(50).required().label("City"),
      state: Joi.string().min(3).max(50).required().label("State"),
      country: Joi.string().min(3).max(50).required().label("Country"),
      zipCode: Joi.string().min(3).max(50).required().label("Zip Code"),
    })
      .required()
      .label("Address"),
    contact: Joi.string().min(3).max(10).required().label("Contact"),
    description: Joi.string().min(50).max(500).required().label("Description"),
    website: Joi.string().required().label("Website"),
  }).required(),
});

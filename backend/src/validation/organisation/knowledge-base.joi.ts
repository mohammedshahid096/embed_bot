import { celebrate, Joi } from "celebrate";

export const addFaqToKnowledgeBaseValidation = celebrate({
  body: Joi.object({
    collectionName: Joi.string()
      .min(3)
      .max(50)
      .required()
      .label("collectionName"),
    faqItems: Joi.array()
      .items(
        Joi.object({
          question: Joi.string().min(3).max(500).required().label("Question"),
          answer: Joi.string().min(3).max(500).required().label("Answer"),
        }),
      )
      .min(1)
      .max(10)
      .required()
      .label("FAQ Items"),
  }).required(),
});

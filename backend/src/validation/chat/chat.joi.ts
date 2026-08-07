import { celebrate, Joi } from "celebrate";

export const newChatSessionValidation = celebrate({
  params: Joi.object({
    chatbotId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("Chatbot ID")
      .messages({
        "string.pattern.base": '"Chatbot ID" must be a valid MongoDB ObjectId',
      }),
  }),
  body: Joi.object({
    origin: Joi.string().required(),
    query: Joi.string().required(),
  }).required(),
});

export const agentChatValidation = celebrate({
  params: Joi.object({
    chatbotId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("Chatbot ID")
      .messages({
        "string.pattern.base": '"Chatbot ID" must be a valid MongoDB ObjectId',
      }),
    sessionId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required()
      .label("Session ID")
      .messages({
        "string.pattern.base": '"Session ID" must be a valid MongoDB ObjectId',
      }),
  }),
  body: Joi.object({
    inputQuestion: Joi.string().required(),
  }).required(),
});

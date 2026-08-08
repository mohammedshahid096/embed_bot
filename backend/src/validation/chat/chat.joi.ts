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

export const updateChatBotDetailsValidation = celebrate({
  body: Joi.object({
    config: Joi.object({
      general: Joi.object({
        botName: Joi.string().max(100).allow(""),
        welcomeMessage: Joi.string().max(500).allow(""),
        inputPlaceholder: Joi.string().max(200).allow(""),
      }),
      theme: Joi.object({
        accentColor: Joi.string().max(20).allow(""),
        backgroundColor: Joi.string().max(20).allow(""),
        textColor: Joi.string().max(20).allow(""),
        borderColor: Joi.string().max(20).allow(""),
        borderRadius: Joi.number().min(0).max(100),
      }),
      button: Joi.object({
        bgColor: Joi.string().max(20).allow(""),
        textColor: Joi.string().max(20).allow(""),
        borderRadius: Joi.number().min(0).max(100),
        width: Joi.number().min(20).max(500),
        maxWidth: Joi.number().min(20).max(500),
      }),
      input: Joi.object({
        bgColor: Joi.string().max(20).allow(""),
        textColor: Joi.string().max(20).allow(""),
        borderColor: Joi.string().max(20).allow(""),
        borderRadius: Joi.number().min(0).max(100),
      }),
      messages: Joi.object({
        botBgColor: Joi.string().max(20).allow(""),
        botTextColor: Joi.string().max(20).allow(""),
        userBgColor: Joi.string().max(20).allow(""),
        userTextColor: Joi.string().max(20).allow(""),
      }),
    }).required(),
  }).required(),
});


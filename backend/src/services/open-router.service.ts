import { OpenRouter } from "@openrouter/sdk";
import config from "../config/index.config";

const CleanContentPromp = `
You are a website content cleaning assistant.

Your task is to clean extracted website content while preserving its meaning exactly.

Rules:
- Do NOT summarize.
- Do NOT rewrite for style or readability.
- Do NOT change wording unless required to fix obvious formatting issues.
- Do NOT add any new information.
- Do NOT remove important information.
- Remove navigation menus, headers, footers, sidebars, cookie notices, advertisements, breadcrumbs, pagination, social media links, repeated elements, and other website chrome.
- Remove duplicate paragraphs and duplicate lines.
- Remove excessive whitespace and blank lines.
- Preserve headings, paragraphs, bullet lists, numbered lists, tables, and code blocks whenever possible.
- Keep the original order of the content.
- If the input is already clean, return it unchanged.
- Return ONLY the cleaned content.
          `;

type OpenRouterModels =
  | "google/gemma-4-26b-a4b-it:free"
  | "qwen/qwen3-next-80b-a3b-instruct:free";

type CleanContentOpenRouterResponse = {
  message: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  result: any;
};

class OpenRouterService {
  openRouter: OpenRouter;
  constructor() {
    this.openRouter = new OpenRouter({
      apiKey: config.openRouter.API_KEY,
    });
  }

  async cleanContentOpenRouter(
    content: string,
    { model }: { model: OpenRouterModels } = {
      model: "google/gemma-4-26b-a4b-it:free",
    },
  ): Promise<CleanContentOpenRouterResponse | null> {
    try {
      const result = await this.openRouter.chat.send({
        chatRequest: {
          temperature: 0,
          model: model,
          messages: [
            {
              role: "system",
              content: CleanContentPromp.trim(),
            },
            {
              role: "user",
              content,
            },
          ],
        },
      });

      const chatResult = result as any;

      const rawContent = chatResult?.choices?.[0]?.message?.content;
      const message =
        typeof rawContent === "string"
          ? rawContent
          : Array.isArray(rawContent)
            ? rawContent
                .filter(
                  (item) => "text" in item && typeof item.text === "string",
                )
                .map((item) => (item as { text: string }).text)
                .join("")
            : "";

      const response = {
        message,
        usage: {
          promptTokens: chatResult?.usage?.promptTokens || 0,
          completionTokens: chatResult?.usage?.completionTokens || 0,
          totalTokens: chatResult?.usage?.totalTokens || 0,
        },
        result: chatResult,
      };

      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}

export default OpenRouterService;

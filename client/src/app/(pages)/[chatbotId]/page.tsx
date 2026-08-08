import { ChatWidget } from "@/view/features/chat";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{
    chatbotId: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { chatbotId } = await params;
  return {
    title: `Chatbot - ${chatbotId}`,
    description: `Interactive Chatbot Widget for ID ${chatbotId}`,
  };
}

export default async function ChatbotPage({ params }: PageProps) {
  const { chatbotId } = await params;

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-950 p-4 font-sans">
      <ChatWidget chatbotId={chatbotId} isClient={true} />
    </div>
  );
}

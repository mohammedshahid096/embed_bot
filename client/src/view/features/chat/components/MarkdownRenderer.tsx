import React, { memo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import "../css/markdown.css";
import remarkGfm from "remark-gfm";
import { getTheme } from "@/helpers/theme.helper";

interface MarkdownRendererProps {
  answer: string;
}

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: React.ReactNode;
  props: any;
}

const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
  const activeTheme: "dark" | "light" = getTheme() || "dark";
  const [isCopied, setisCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const code = String(children).trim();

  const handleCopy = () => {
    try {
      navigator?.clipboard?.writeText(code);
      setisCopied(true);
      setTimeout(() => {
        setisCopied(false);
      }, 1000);
      // toast.success("Successfully copied the code");
    } catch (error) {
      // toast.success("Error while copying the code");
    }
  };

  if (inline) {
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  }

  return (
    <div className="relative">
      {isCopied ? (
        <button className=" absolute top-2 right-2 z-10 cursor-pointer border-0 dark:text-white text-black">
          <Check size={18} />
        </button>
      ) : (
        <button
          onClick={handleCopy}
          className=" absolute top-2 right-2 z-10 cursor-pointer border-0 dark:text-white text-black"
        >
          <Copy size={18} />
        </button>
      )}
      <SyntaxHighlighter
        style={activeTheme === "light" ? oneLight : oneDark}
        language={match?.[1] || ""}
        PreTag="div"
        {...props}
        showLineNumbers={true}
        wrapLines={true}
        wrapLongLines={true}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const MarkdownRenderer = ({ answer }: MarkdownRendererProps) => {
  return (
    <div id="markdown_div" className="w-full">
      <ReactMarkdown
        components={{
          code: CodeBlock,
          p({ node, children, ...props }: any) {
            const childArray = React.Children.toArray(children);

            // Check if children are all inline-safe (text or <code>)
            const containsOnlyTextOrInlineCode = childArray.every(
              (child: any) =>
                typeof child === "string" ||
                (typeof child === "object" && child?.type === "code"),
            );

            if (containsOnlyTextOrInlineCode) {
              return <p {...props}>{children}</p>;
            }

            // Skip wrapping block elements in <p>
            return <>{children}</>;
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {answer}
      </ReactMarkdown>
    </div>
  );
};

export default memo(MarkdownRenderer);

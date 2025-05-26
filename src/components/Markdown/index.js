import { CheckOutlined, CopyOutlined, LinkOutlined } from "@ant-design/icons";
import { Flex } from "antd";
import "github-markdown-css/github-markdown-dark.css";
import "github-markdown-css/github-markdown-light.css";
import "highlight.js/styles/github.css"; // Import a highlight.js style
import React, { useState } from "react";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import { getCleanMarkdownString, handleCopy } from "../../utils/helperFunction";
import { MarkdownBody } from "./style";

const rehypePlugins = [rehypeSlug, rehypeRaw, rehypeSanitize, rehypeHighlight];
const remarkPlugins = [remarkToc, remarkGfm];

/**
 * Recursively extract text content from any React node.
 */
const extractText = (node) => {
  if (typeof node === "string") return node;
  if (Array.isArray(node))
    return node.map((child) => extractText(child)).join("");
  if (React.isValidElement(node)) return extractText(node.props.children);
  return "";
};

/**
 * CodeBlock Component:
 * Wraps <pre> content and adds a copy button that copies only the code text.
 */
const CodeBlock = ({ children, ...props }) => {
  const [copied, setCopied] = useState(false);
  // Extract language from className of code tag inside pre
  let language = "";
  if (children?.props?.className?.includes("language-")) {
    const match = children?.props?.className?.match?.(/language-(\w+)/);
    if (match) {
      language = match[1];
    }
  }

  const handleCopyCodeBlock = () => {
    const codeText = extractText(children);
    handleCopy(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#e5e7eb", // slightly darker than code block bg
          padding: "12px",
          borderTopLeftRadius: ".375rem",
          borderTopRightRadius: ".375rem",
          fontSize: "0.75rem",
          fontWeight: 500,
          fontFamily: "monospace",
          color: "#111827",
        }}
      >
        <span>{language}</span>
        <button
          onClick={handleCopyCodeBlock}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#111827",
          }}
        >
          {copied ? (
            <Flex gap={4} align="center">
              Copied <CheckOutlined />
            </Flex>
          ) : (
            <Flex gap={4} align="center">
              Copy
              <CopyOutlined />
            </Flex>
          )}
        </button>
      </div>

      {/* Code */}
      <pre
        {...props}
        style={{
          color: "grey",
          backgroundColor: "#f9fafb",
          overflowX: "auto",
          fontWeight: 400,
          fontSize: ".875em",
          lineHeight: "1.7142857",
          borderRadius: "0px",
          borderBottomLeftRadius: ".375rem",
          borderBottomRightRadius: ".375rem",
          margin: 0,
          padding: "0.75em",
        }}
      >
        {children}
      </pre>
    </div>
  );
};

const CodeBlockWithoutCopy = ({ children, ...props }) => {
  return (
    <pre
      {...props}
      style={{
        color: "grey",
        backgroundColor: "#f9fafb",
        overflowX: "auto",
        fontWeight: 400,
        fontSize: ".875em",
        lineHeight: "1.7142857",
        borderRadius: ".375rem",
        padding: ".2em .2em",
      }}
    >
      {children}
    </pre>
  );
};

const CustomLink = ({ children, ...rest }) => (
  <a
    {...rest}
    style={{
      color: "inherit",
      textDecoration: "underline",
      fontStyle: "italic",
    }}
    target="_blank"
  >
    {children}{" "}
    <sup>
      <LinkOutlined style={{ fontSize: "10px" }} />
    </sup>
  </a>
);

const CustomTable = (props) => <table className="my-table" {...props} />;

const MarkdownComponent = ({
  markdown,
  markdownStyleOverride = true,
  enableCopyCodeBlocks = false,
}) => {
  markdown = getCleanMarkdownString(markdown);
  return (
    <MarkdownBody
      className="markdown-body light"
      markdownStyleOverride={markdownStyleOverride}
    >
      <Markdown
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={{
          pre: enableCopyCodeBlocks ? CodeBlock : CodeBlockWithoutCopy,
          a: CustomLink,
          table: CustomTable,
        }}
      >
        {markdown}
      </Markdown>
    </MarkdownBody>
  );
};

export default MarkdownComponent;

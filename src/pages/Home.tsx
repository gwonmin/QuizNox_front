import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import readmeContent from "../../README.md?raw";
import "github-markdown-css/github-markdown.css";
import "../styles/markdown-theme.css";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <article className="markdown-body">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {readmeContent}
        </ReactMarkdown>
      </article>
    </div>
  );
}

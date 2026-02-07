import readmeContent from "../../README.md?raw";
import { MarkdownViewer } from "../components/MarkdownViewer";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <MarkdownViewer content={readmeContent} />
    </div>
  );
}

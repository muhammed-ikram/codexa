import CodeEditor from "../components/CodeEditor";

function CodeEditorPage() {
  return (
    <div className="h-screen bg-monaco-bg text-monaco-text flex flex-col">
      <CodeEditor />
    </div>
  );
}

export default CodeEditorPage;
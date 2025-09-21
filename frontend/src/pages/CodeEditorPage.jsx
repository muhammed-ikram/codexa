import CodeEditor from "../components/CodeEditor";

function CodeEditorPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-monaco-text flex flex-col">
      <CodeEditor />
      {/* Footer */}
      <div className="py-3 text-center text-gray-500 text-xs border-t border-gray-800">
        <p className="mb-1">
          <span className="font-medium text-gray-400 italic">CodeXA - for the engineers, by the engineers</span>
        </p>
        <p>© 2025 CodeXA. All rights reserved.</p>
      </div>
    </div>
  );
}

export default CodeEditorPage;
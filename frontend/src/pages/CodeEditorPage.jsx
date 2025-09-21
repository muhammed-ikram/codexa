import CodeEditor from "../components/CodeEditor";

function CodeEditorPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-black text-monaco-text flex flex-col">
      <CodeEditor />
      {/* Footer */}
      <div className="py-1 text-center text-gray-500 text-xs border-t border-gray-800 transition-all duration-300 hover:border-gray-700">
        <div className="flex items-center justify-center">
          <img src="/src/assets/logo.png" alt="CodeXA Logo" className="w-4 h-4 mr-2 transition-transform duration-300 hover:scale-110" />
          <span className="font-medium text-gray-400 italic text-xs transition-colors duration-300 hover:text-gray-300">CodeXA - for the engineers, by the engineers</span>
        </div>
        <p className="mt-1 text-xs transition-colors duration-300 hover:text-gray-300">© 2025 CodeXA. All rights reserved.</p>
      </div>
    </div>
  );
}

export default CodeEditorPage;
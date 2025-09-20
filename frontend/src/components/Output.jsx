import { useState } from "react";
import { executeCode } from "../api";

const Output = ({ editorRef, language }) => {
  const [output, setOutput] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const runCode = async () => {
    const sourceCode = editorRef.current.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const { run: result } = await executeCode(language, sourceCode);
      setOutput(result.output.split("\n"));
      result.stderr ? setIsError(true) : setIsError(false);
    } catch (error) {
      console.log(error);
      alert(`An error occurred: ${error.message || "Unable to run code"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <p className="mb-2 text-lg text-monaco-text">
        Output
      </p>
      <button
        className={`monaco-button monaco-button-primary mb-4 ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={runCode}
        disabled={isLoading}
      >
        {isLoading ? 'Running...' : 'Run Code'}
      </button>
      <div
        className={`h-[75vh] p-2 border rounded monaco-input ${
          isError ? 'text-red-400 border-red-500' : 'text-monaco-text border-monaco-border'
        }`}
      >
        {output
          ? output.map((line, i) => <p key={i} className="text-sm">{line}</p>)
          : 'Click "Run Code" to see the output here'}
      </div>
    </div>
  );
};

export default Output;

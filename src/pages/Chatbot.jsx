import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chatbot = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const genAI = new GoogleGenerativeAI("AIzaSyALxkTet1A94VtGpf10TMZtV6aT5Bu78xw");

  const handleGenerateResponse = async () => {
    if (!prompt.trim()) {
      setResponse("Please enter a prompt.");
      return;
    }

    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      setResponse(result.response.text);
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-container p-4 max-w-lg mx-auto border rounded-md shadow-md flex-col">
      <h1 className="text-xl font-bold mb-4 text-white text-center">AI Chatbot Assitance </h1>
      <textarea
        className="w-full p-2 border rounded-md mb-4"
        rows="2"
        placeholder="Enter your prompt here..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        onClick={handleGenerateResponse}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Response"}
      </button>
      {response && (
        <div className="response mt-4 p-4 bg-gray-100 rounded-md  text-white">
          <h2 className="text-lg font-semibold">Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;

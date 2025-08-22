"use client";

import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface StreamResponse {
  thread_id?: string;
  model?: string;
  content?: string;
  section?: string;
  type?: string;
  status?: string;
  error?: string;
}

interface ChatInterfaceProps {
  onClose: () => void;
  isFloating?: boolean;
}

export default function ChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAssistantMessageRef = useRef<string>("");

  // Load thread_id from localStorage on component mount
  useEffect(() => {
    const savedThreadId = localStorage.getItem("chat_thread_id");
    if (savedThreadId) {
      setThreadId(savedThreadId);
    }
  }, []);

  // Save thread_id to localStorage when it changes
  useEffect(() => {
    if (threadId) {
      localStorage.setItem("chat_thread_id", threadId);
    }
  }, [threadId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStreamResponse = (data: StreamResponse, event: string) => {
    console.log("Stream event:", event, "Data:", data);

    if (event === "start") {
      if (data.thread_id) {
        setThreadId(data.thread_id);
      }
      currentAssistantMessageRef.current = "";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } else if (event === "content" && data.content) {
      currentAssistantMessageRef.current += data.content;
      setMessages((prev) =>
        prev.map((msg, index) =>
          index === prev.length - 1 && !msg.isUser
            ? { ...msg, content: currentAssistantMessageRef.current }
            : msg
        )
      );
    } else if (event === "done") {
      setIsLoading(false);
    } else if (event === "error") {
      console.error("Stream error:", data);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `Error: ${data.error || "An error occurred"}`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const requestPayload = {
        message: userMessage.content,
        thread_id: threadId,
        company_codes: ["SKINIOR"], // Add company codes as required by the backend
        context: {
          user_type: "web_user",
          session_id: `session_${Date.now()}`,
        },
      };

      console.log("Sending request:", requestPayload);

      const response = await fetch("http://localhost:8001/chat/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from agent");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let currentEvent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();

          if (trimmedLine === "" || trimmedLine === "data: [DONE]") {
            continue;
          }

          if (trimmedLine.startsWith("event: ")) {
            currentEvent = trimmedLine.substring(7);
            continue;
          }

          if (trimmedLine.startsWith("data: ")) {
            try {
              const dataStr = trimmedLine.substring(6);
              if (dataStr === "[DONE]") {
                setIsLoading(false);
                break;
              }

              const data = JSON.parse(dataStr);
              handleStreamResponse(data, currentEvent || "content");
            } catch (e) {
              console.error("Error parsing SSE data:", e, "Line:", trimmedLine);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: "Sorry, there was an error processing your request.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setThreadId(null);
    localStorage.removeItem("chat_thread_id");
    currentAssistantMessageRef.current = "";
  };

  return (
    <div className="bg-white rounded-lg shadow-xl w-96 h-96 flex flex-col border">
      <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-semibold">AI Assistant</h3>
        <div className="flex items-center space-x-2">
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="hover:bg-blue-700 rounded p-1 text-xs"
              title="Clear conversation"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="hover:bg-blue-700 rounded p-1"
            aria-label="Close chat"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {process.env.NODE_ENV === "development" && threadId && (
          <div className="text-xs text-gray-400 border-b pb-2">
            Thread ID: {threadId}
          </div>
        )}

        {messages.length === 0 && (
          <div className="text-gray-500 text-center">
            Start a conversation with the AI assistant
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isUser
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div
                className={`text-xs mt-1 ${
                  message.isUser ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg p-2 transition-colors"
            aria-label="Send message"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

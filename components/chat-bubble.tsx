"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, User, Loader2, MinusCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

import { useChat } from "@/contexts/ChatContext";

export function ChatBubble() {
  const { isOpen, setIsOpen, messages, setMessages, input, setInput } = useChat();
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) throw new Error("Chat failed");

      const reader = response.body?.getReader();
      const decoder = new TextEncoder().encode(""); // Just for reference
      const assistantMessage: Message = { role: "assistant", content: "" };
      
      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            return [...prev.slice(0, -1), { ...last, content: last.content + chunk }];
          });
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I'm having trouble connecting right now. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-gray-900/95 border border-gray-700/50 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-600/20 to-teal-600/20 border-b border-gray-700/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <Sparkles className="w-4 h-4 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">CineSafe Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-medium">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <MinusCircle size={20} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-2">
                    <MessageCircle className="w-8 h-8 text-cyan-400/50" />
                  </div>
                  <h4 className="text-white font-semibold">How can I help?</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Ask me about movie safety, ratings, or for family-friendly recommendations!
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    {["Is Moana safe?", "Movies for 5 year olds", "Rated PG action movies"].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-[11px] px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full text-gray-400 transition-colors"
                      >
                        &quot;{q}&quot;
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      m.role === "user" ? "bg-gray-700" : "bg-cyan-500/10 border border-cyan-500/20"
                    }`}>
                      {m.role === "user" ? <User size={14} className="text-gray-400" /> : <Sparkles size={14} className="text-cyan-400" />}
                    </div>
                    <div
                      className={`p-3 rounded-2xl text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-cyan-600 text-white rounded-tr-none"
                          : "bg-gray-800/80 text-gray-200 border border-gray-700/50 rounded-tl-none"
                      }`}
                    >
                      {m.content || (isLoading && i === messages.length - 1 ? "..." : "")}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%] items-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Loader2 size={14} className="text-cyan-400 animate-spin" />
                    </div>
                    <div className="px-3 py-2 bg-gray-800/50 rounded-2xl rounded-tl-none border border-gray-700/30">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-700/50">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask a question..."
                  className="w-full pl-4 pr-12 py-3 bg-gray-800 border border-gray-700 focus:border-cyan-500 rounded-2xl text-sm text-white placeholder-gray-500 outline-none transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-cyan-500 text-gray-900 flex items-center justify-center hover:bg-cyan-400 transition-colors disabled:opacity-50 disabled:hover:bg-cyan-500"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? "bg-gray-800 text-white rotate-90" : "bg-cyan-500 text-gray-900"
        }`}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-teal-400 border-4 border-[hsl(220,20%,8%)] rounded-full"
          />
        )}
      </motion.button>
    </div>
  );
}

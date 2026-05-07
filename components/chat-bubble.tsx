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
            initial={{ opacity: 0, scale: 0.95, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 25 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="absolute bottom-20 right-0 w-[360px] sm:w-[410px] h-[580px] max-h-[80vh] bg-gray-950/95 border border-gray-800/80 rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl flex flex-col overflow-hidden ring-1 ring-cyan-500/10"
          >
            {/* Header */}
            <div className="p-4.5 bg-gradient-to-r from-cyan-500/15 to-teal-500/5 border-b border-gray-800/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-lg shadow-cyan-500/15">
                  <Sparkles className="w-4.5 h-4.5 text-gray-950" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-tight">CineSafe Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-400"></span>
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold tracking-wide uppercase">AI Engine Active</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800/50 rounded-lg"
              >
                <MinusCircle size={18} />
              </button>
            </div>

            {/* Messages body */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent bg-gray-950/20"
            >
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-inner">
                    <MessageCircle className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-base">How can I help you today?</h4>
                    <p className="text-xs text-gray-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                      Ask me if a movie is suitable for your kids, analyze specific safety elements, or request dynamic family-safe curation.
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 w-full pt-2">
                    {["Is Moana safe for a 4-year-old?", "Suggest funny PG family comedies", "Parents rating guide for Shrek"].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-xs text-left px-3.5 py-2 bg-gray-900/60 hover:bg-cyan-500/10 border border-gray-800 hover:border-cyan-500/20 rounded-xl text-gray-400 hover:text-cyan-400 transition-all duration-200"
                      >
                        &quot;{q}&quot;
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <AnimatePresence initial={false}>
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    layout
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`flex gap-2.5 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`flex-shrink-0 w-7.5 h-7.5 rounded-xl flex items-center justify-center shadow-md ${
                        m.role === "user" ? "bg-gray-800 border border-gray-750 text-gray-300" : "bg-cyan-500/10 border border-cyan-500/25 text-cyan-400"
                      }`}>
                        {m.role === "user" ? <User size={13} /> : <Sparkles size={13} />}
                      </div>
                      <div
                        className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                          m.role === "user"
                            ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-tr-none font-medium"
                            : "bg-gray-900/90 text-gray-200 border border-gray-800 rounded-tl-none"
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">
                          {m.content || (isLoading && i === messages.length - 1 ? "..." : "")}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex gap-2.5 max-w-[85%] items-center">
                    <div className="w-7.5 h-7.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center">
                      <Loader2 size={13} className="text-cyan-400 animate-spin" />
                    </div>
                    <div className="px-3.5 py-2.5 bg-gray-900/40 rounded-2xl rounded-tl-none border border-gray-800">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-gray-950/80 border-t border-gray-800/60 backdrop-blur-md">
              <div className="relative flex items-center bg-gray-900 border border-gray-800 focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/20 rounded-2xl transition-all p-1">
                <input
                  type="text"
                  placeholder="Ask any parental safety questions..."
                  className="w-full pl-3.5 pr-12 py-2.5 bg-transparent text-xs text-white placeholder-gray-500 outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-cyan-500 text-gray-950 flex items-center justify-center hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:hover:bg-cyan-500 shadow-md font-bold"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulsing Chat Trigger Bubble Button */}
      <div className="relative">
        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-cyan-500 rounded-full blur-xl pointer-events-none"
          />
        )}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(6,182,212,0.15)] transition-all duration-300 z-10 ${
            isOpen ? "bg-gray-900 border border-gray-800 text-white rotate-90" : "bg-cyan-500 text-gray-950"
          }`}
          aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        >
          {isOpen ? <X size={22} /> : <MessageCircle size={22} className="stroke-[2.5]" />}
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-teal-400 border-[3.5px] border-[hsl(220,20%,8%)] rounded-full shadow-sm"
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}

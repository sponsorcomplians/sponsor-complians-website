import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE =
  "Hi, I'm IANS — your sponsor compliance assistant from Sponsor ComplIANS. I can help you with compliance audits, recruitment, HR services, or any questions about protecting your sponsor licence. What can I help you with today?";

const QUICK_QUESTIONS = [
  "What services do you offer?",
  "How much does an audit cost?",
  "I got an email from the Home Office",
  "Tell me about the Hub software",
  "What is the 65-document framework?",
  "How do I post a job for free?",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [showPulse, setShowPulse] = useState(true);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const startConversation = trpc.chatbot.startConversation.useMutation({
    onSuccess: (data) => {
      setConversationId(data.conversationId);
    },
  });

  const logMessage = trpc.chatbot.logMessage.useMutation();

  const askMutation = trpc.chatbot.ask.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      // Log assistant reply
      if (conversationId) {
        logMessage.mutate({
          conversationId,
          role: "assistant",
          content: data.reply,
          intentTag: data.intentTag,
        });
      }
    },
    onError: () => {
      const errorMsg =
        "I apologise, I'm having trouble connecting right now. Please try again or contact us at 020 3618 6968.";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, askMutation.isPending]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Start a new conversation when the chat opens for the first time
  useEffect(() => {
    if (isOpen && !conversationId && !startConversation.isPending) {
      startConversation.mutate({
        visitorName: user?.name ?? undefined,
        visitorEmail: user?.email ?? undefined,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
      });
    }
  }, [isOpen]);

  const sendMessage = (text: string) => {
    if (!text.trim() || askMutation.isPending) return;
    const userMsg: Message = { role: "user", content: text.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setShowPulse(false);

    // Log user message
    if (conversationId) {
      logMessage.mutate({
        conversationId,
        role: "user",
        content: text.trim(),
      });
    }

    askMutation.mutate({
      message: text.trim(),
      conversationId: conversationId ?? undefined,
      history: updatedMessages.slice(1).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickQuestion = (q: string) => {
    sendMessage(q);
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-4 sm:right-6 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "520px", maxHeight: "calc(100vh - 140px)" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0D1B2A] to-[#1B3A5C] px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-[#00C3FF]/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#00C3FF]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Chat with IANS</p>
              <p className="text-[#00C3FF] text-xs flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full inline-block animate-pulse" />
                Online
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full bg-[#0D1B2A] flex items-center justify-center shrink-0 mt-1">
                    <Bot className="w-4 h-4 text-[#00C3FF]" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#00C3FF] text-white rounded-br-sm"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-full bg-[#00C3FF]/20 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4 text-[#00C3FF]" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {askMutation.isPending && (
              <div className="flex gap-2 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#0D1B2A] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-[#00C3FF]" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (only show at start) */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white shrink-0">
              <p className="text-xs text-gray-500 mb-1.5">Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs px-2.5 py-1.5 bg-gray-100 hover:bg-[#00C3FF]/10 hover:text-[#00C3FF] rounded-full text-gray-600 transition-colors border border-transparent hover:border-[#00C3FF]/30"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="px-3 py-3 border-t border-gray-200 bg-white flex gap-2 items-center shrink-0"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask IANS a question..."
              className="flex-1 text-sm bg-gray-100 rounded-full px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#00C3FF]/40 transition-shadow text-gray-800 placeholder:text-gray-400"
              disabled={askMutation.isPending}
            />
            <button
              type="submit"
              disabled={!input.trim() || askMutation.isPending}
              className="w-9 h-9 rounded-full bg-[#00C3FF] hover:bg-[#00B0E6] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
              aria-label="Send message"
            >
              {askMutation.isPending ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-4 py-1.5 bg-gray-50 border-t border-gray-100 shrink-0">
            <p className="text-[10px] text-gray-400 text-center">
              Powered by IANS — Sponsor ComplIANS AI — responses are for guidance only
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowPulse(false);
        }}
        className={`fixed bottom-6 right-4 sm:right-6 z-[9999] w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-gray-700 hover:bg-gray-600 rotate-0"
            : "bg-gradient-to-br from-[#00C3FF] to-[#0D1B2A] hover:shadow-xl hover:scale-105"
        }`}
        aria-label={isOpen ? "Close chat" : "Ask IANS"}
        title={isOpen ? "Close chat" : "Ask IANS"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {showPulse && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            )}
          </>
        )}
      </button>
    </>
  );
}

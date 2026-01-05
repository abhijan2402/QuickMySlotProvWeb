"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RobotOutlined, SendOutlined, CloseOutlined, RobotFilled } from "@ant-design/icons";
import { BiSend } from "react-icons/bi";
import { FaRobot } from "react-icons/fa6";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi there! I'm QuickMySlot Assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userMsgCount, setUserMsgCount] = useState(0);

  const messagesEndRef = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  // ✅ Auto-scroll when new messages appear
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setUserMsgCount((prev) => prev + 1);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const reply = getBotResponse(input);
      setMessages((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 900);
  };

  const getBotResponse = (msg) => {
    const lower = msg.toLowerCase();

    // ---- Keyword Responses ----
    if (lower.includes("register") || lower.includes("signup"))
      return "📝 You can register as a provider by visiting [Provider Registration](https://provider.quickmyslot.com/register).";
    if (lower.includes("login"))
      return "🔐 Login to your provider account here: [Provider Login](https://provider.quickmyslot.com/login).";
    if (lower.includes("service") || lower.includes("add service"))
      return "⚙️ You can add or manage your services from the 'Services' section once logged in.";
    if (lower.includes("payment") || lower.includes("payout"))
      return "💳 Payments are processed weekly to your registered bank account.";
    if (lower.includes("support") || lower.includes("help"))
      return "📞 Our support team is always here for you! Visit [Support Page](https://provider.quickmyslot.com/support) for assistance.";
    if (lower.includes("slot") || lower.includes("booking"))
      return "📅 You can view and manage all bookings under the 'My Bookings' tab in your dashboard.";
    if (lower.includes("cancel") || lower.includes("remove"))
      return "❌ You can cancel a slot anytime before the scheduled time using the dashboard.";

    // ---- After multiple messages ----
    if (userMsgCount >= 3)
      return `🤖 It looks like you have multiple queries! Please reach our [Support Page](https://provider.quickmyslot.com/support) for quick help.`;

    // ---- Default Fallback ----
    return "🤔 I'm not sure about that. Please check your Provider Dashboard or visit our Support Page (https://provider.quickmyslot.com/support) for more help!";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* Floating Chat Icon */}
      <button
        onClick={toggleChat}
        className="fixed bottom-12 right-6 bg-[#EE5138] text-[#ffff] p-4 rounded-full shadow-lg shadow-orange-300 hover:scale-105 transition-transform z-[9999]"
        style={{
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <FaRobot style={{ fontSize: "34px" }} />
      </button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-20 right-6 w-80 bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden border border-gray-200 z-[9999]"
          >
            {/* Header */}
            <div className="bg-[#EE5138] text-white p-3 text-lg font-semibold flex justify-between items-center">
              <div className="flex items-center gap-2">
                <FaRobot />
                <div className="font-bold">
                  <span className="text-black ">Quick</span>
                  MySlot
                </div>
              </div>
              <button
                onClick={toggleChat}
                className="text-white text-lg font-bold hover:opacity-80"
              >
                <CloseOutlined />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 max-h-[350px] custom-scrollbar">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[75%] text-[13px] leading-snug ${
                      msg.sender === "user"
                        ? "bg-[#EE5138] text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                    dangerouslySetInnerHTML={{
                      __html: msg.text.replace(
                        /\[(.*?)\]\((.*?)\)/g,
                        `<a href='$2' target='_blank' class='text-[#EE5138] underline'>$1</a>`
                      ),
                    }}
                  />
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-2xl text-sm rounded-bl-none animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex border-t p-2 bg-white">
              <input
                type="text"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1 p-2 text-sm outline-none border rounded-lg mr-2 focus:ring-1 focus:ring-[#EE5138] text-black"
              />
              <button
                onClick={sendMessage}
                className="bg-[#EE5138] hover:bg-[#d83e28] text-white px-3 py-2 rounded-lg"
              >
                <SendOutlined />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;

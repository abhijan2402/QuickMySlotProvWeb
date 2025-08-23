import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaPlusCircle, FaCheckCircle, FaClock } from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb";

export default function Support() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tickets, setTickets] = useState([
    {
      id: 1,
      title: "Services not showing",
      status: "Open",
      description:
        "Services is generally defined as an asset or a collection of assets owned by an individual, group, or entity...",
    },
    {
      id: 2,
      title: "Payment issue",
      status: "Resolved",
      description:
        "The first Restatement defines property as anything, tangible or intangible, whereby a legal relationship between persons and the State...",
    },
  ]);
  const [form, setForm] = useState({ title: "", description: "" });

  const handleSubmit = () => {
    if (!form.title || !form.description) return;
    setTickets([
      ...tickets,
      {
        id: tickets.length + 1,
        title: form.title,
        description: form.description,
        status: "Open",
      },
    ]);
    setForm({ title: "", description: "" });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="max-w-6xl mt-4 mx-auto p-6 space-y-8">
        <Breadcrumb propertyTitle={"Support"}/>
        <div className="min-h-screen bg-gray-50 px-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-4xl font-bold text-[#6961AB]">Support</h2>
              <p className="text-gray-600 mt-2 text-lg">
                Need help? Browse existing tickets or raise a new one — our team
                is here for you.
              </p>
            </motion.div>

            <motion.button
              onClick={() => setIsModalOpen(true)}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 bg-gradient-to-r from-[#6961AB] to-[#6961AB] text-white px-5 py-3 rounded-lg shadow-lg hover:opacity-90 transition"
            >
              <FaPlusCircle /> Raise a Ticket
            </motion.button>
          </div>

          {/* Tickets List */}
          <div className="grid gap-5">
            {tickets.map((ticket) => (
              <motion.div
                key={ticket.id}
                className="bg-white p-5 rounded-xl shadow-sm hover:shadow-lg transition-shadow flex justify-between items-start gap-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {ticket.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                    {ticket.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {ticket.status === "Resolved" ? (
                    <FaCheckCircle className="text-green-600" />
                  ) : (
                    <FaClock className="text-yellow-500" />
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      ticket.status === "Resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="bg-white p-6 rounded-xl max-w-md w-full shadow-xl relative"
                  initial={{ scale: 0.85 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.85 }}
                >
                  {/* Close Btn */}
                  <button
                    className="absolute top-3 right-3 text-gray-400 hover:text-gray-800"
                    onClick={() => setIsModalOpen(false)}
                  >
                    <FaTimes size={18} />
                  </button>

                  <h3 className="text-2xl font-bold mb-5 text-[#6961AB]">
                    Raise a Ticket
                  </h3>

                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    placeholder="Enter ticket title"
                    className="w-full text-black border p-2 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-[#7C0902]/50"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />

                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe your issue"
                    className="w-full border p-2 text-black rounded-md mb-4 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#7C0902]/50"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />

                  <button
                    onClick={handleSubmit}
                    className="w-full bg-[#6961AB] text-white py-2 rounded-md font-semibold hover:bg-[#600601] transition"
                  >
                    Submit Ticket
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

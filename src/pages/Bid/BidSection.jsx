import React, { useState } from "react";
import { useAddbidMutation, useGetbidQuery } from "../../services/bidApi";
import { useSelector } from "react-redux";
import { Button, Modal, Input } from "antd";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  FaClock,
  FaCalendarAlt,
  FaUserTie,
  FaLayerGroup,
  FaGavel,
  FaPlay,
  FaStopwatch,
} from "react-icons/fa";

const BidSection = () => {
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading } = useGetbidQuery();
  const [open, setOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [amount, setAmount] = useState("");
  const [addbid, { isLoading: placingBid }] = useAddbidMutation();

  // 🟩 Open Modal
  const handleOpen = (bid) => {
    setSelectedBid(bid);
    setOpen(true);
  };

  // 🟩 Submit Bid Function (Fixed)
  const handleSubmit = async () => {
    const enteredAmount = parseFloat(amount || 0);
    const walletAmount = parseFloat(user?.wallet || 0);

    if (!enteredAmount || enteredAmount <= 0) {
      toast.error("Please enter a valid bid amount");
      return;
    }

    if (enteredAmount > walletAmount) {
      toast.error("Insufficient wallet balance to place this bid");
      return;
    }

    // const formData = {
    //   bid_id: selectedBid?.id,
    //   amount: enteredAmount,
    // };

    const formData = new FormData();
    formData.append("bid_id", selectedBid?.id);
    formData.append("amount", enteredAmount);

    await addbid(formData)
      .unwrap()
      .then(() => {
        console.log("🎯 Bid Submitted:", formData);
        toast.success(`Bid placed successfully for ₹${enteredAmount}!`);
      })
      .catch(() => {
        toast.error(`Failed to place Bid for ₹${enteredAmount}!`);
      });
    setOpen(false);
    setAmount("");
  };

  // 🟨 Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-lg text-gray-600">
        Loading bids...
      </div>
    );
  }

  const bids = data?.data?.data || [];
  const filteredBids = user?.service_category
    ? bids.filter((b) => b.category_id === Number(user.service_category))
    : bids;

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* 🌟 Hero Section */}
      <div className="relative bg-[#EE4E34] text-white py-16 px-6 text-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-wide"
        >
          Bid Portal — Live Biding & Opportunities
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-gray-200 max-w-2xl mx-auto text-sm sm:text-base"
        >
          Browse ongoing bids and place your offers confidently in real-time.
        </motion.p>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-3xl opacity-30 animate-pulse"></div>
      </div>

      {/* 🏗️ Bid Cards Section */}
      <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {filteredBids.length > 0 ? (
          <div className="space-y-6">
            {filteredBids.map((bid, index) => (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col sm:flex-row overflow-hidden border border-gray-100 hover:-translate-y-1"
              >
                {/* Left Image */}
                <div className="relative sm:w-[320px] w-full">
                  <img
                    src={bid.category?.image || "/default-bid.jpg"}
                    alt={bid.title}
                    className="h-56 sm:h-full w-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#EE4E34]/90 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-md">
                    <FaLayerGroup /> {bid.category?.name || "General"}
                  </div>
                </div>

                {/* Right Side Content */}
                <div className="flex flex-col justify-between p-5 flex-1">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-[#EE4E34] line-clamp-1 mb-2">
                      {bid.title}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base line-clamp-2 mb-4">
                      {bid.description}
                    </p>

                    {/* Dates & Times */}
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <FaPlay className="text-[#EE4E34]" />
                        <span>
                          <b>Bid Starts:</b>{" "}
                          {new Date(bid.bid_date).toLocaleDateString()} at{" "}
                          {bid.start_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaStopwatch className="text-[#EE4E34]" />
                        <span>
                          <b>Bid Ends:</b>{" "}
                          {new Date(bid.bid_end_date).toLocaleDateString()} at{" "}
                          {bid.end_time}
                        </span>
                      </div>
                      {bid.admin && (
                        <div className="flex items-center gap-2">
                          <FaUserTie className="text-[#EE4E34]" />
                          <span>
                            Organizer: {bid.admin?.business_name || "N/A"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Min Bid */}
                    {bid.min_bid_amount && (
                      <div className="flex items-center justify-between text-[#EE4E34] font-medium mt-3 border-t pt-2">
                        <span>Minimum Bid</span>
                        <span>₹{bid.min_bid_amount}</span>
                      </div>
                    )}
                  </div>

                  {/* Place Bid Button */}
                  <div className="mt-5 flex justify-end">
                    <Button
                      icon={<FaGavel />}
                      type="primary"
                      className="bg-[#EE4E34] hover:bg-[#134a4b] w-full sm:w-auto px-8 rounded-xl h-11 font-semibold"
                      onClick={() => handleOpen(bid)}
                    >
                      Place Your Bid
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // 🕊 Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <img
              src="https://illustrations.popsy.co/violet/online-shopping.svg"
              alt="No bids"
              className="w-60 h-60 mb-6 animate-bounce-slow"
            />
            <h2 className="text-2xl font-semibold text-[#EE4E34] mb-2">
              No Active Bids Found
            </h2>
            <p className="text-gray-500 max-w-sm">
              Stay tuned! New opportunities are added frequently. Check back
              soon for your category.
            </p>
          </motion.div>
        )}
      </div>

      {/* 💰 Place Bid Modal */}
      <Modal
        title={
          <span className="text-[#EE4E34] font-semibold text-lg">
            Place Bid for “{selectedBid?.title || "N/A"}”
          </span>
        }
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText={placingBid ? "Placing Bid..." : "Submit Bid"}
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-[#EE4E34] hover:bg-[#134a4b] rounded-md",
          loading: placingBid,
          disabled: placingBid,
        }}
        cancelButtonProps={{
          disabled: placingBid,
        }}
      >
        <div className="space-y-3 mt-2">
          <p className="text-gray-600 text-sm">
            Wallet Balance:{" "}
            <span className="font-semibold text-[#EE4E34]">
              ₹{user?.wallet || 0}
            </span>
          </p>
          <Input
            type="number"
            placeholder="Enter bid amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default BidSection;

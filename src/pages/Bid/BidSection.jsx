import React, { useState } from "react";
import {
  useAddbidMutation,
  useGetbidQuery,
  useUpdateBidMutation,
} from "../../services/bidApi";
import { useSelector } from "react-redux";
import { Button, Modal, Input, Tag } from "antd";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaGavel } from "react-icons/fa";

const BidSection = () => {
  const user = useSelector((state) => state.auth.user);
  const { data, isLoading } = useGetbidQuery();
  const [open, setOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState(null);
  const [amount, setAmount] = useState("");
  const [mode, setMode] = useState("add"); // "add" | "edit"
  const [addbid, { isLoading: placingBid }] = useAddbidMutation();
  const [updateBid, { isLoading: updatingBid }] = useUpdateBidMutation();

  console.log(data);

  // 🟩 Open Modal
  const handleOpen = (bid, type = "add") => {
    setSelectedBid(bid);
    setMode(type);
    setAmount(bid.user_bid_amount || ""); // prefill if available
    setOpen(true);
  };

  // 🟩 Submit or Update
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

    const formData = new FormData();
    formData.append("amount", enteredAmount);
    if (mode === "add") formData.append("bid_id", selectedBid?.id);

    try {
      if (mode === "add") {
        await addbid({ formData, id: selectedBid?.id }).unwrap();
        toast.success(`Bid placed successfully for ₹${enteredAmount}!`);
      } else {
        await updateBid({ formData, id: selectedBid?.id }).unwrap();
        toast.success(`Bid updated successfully to ₹${enteredAmount}!`);
      }
    } catch (err) {
      toast.error(`Failed to ${mode === "add" ? "place" : "update"} bid!`);
    }

    setOpen(false);
    setAmount("");
  };

  // 🟨 Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-lg text-gray-600">
        Loading bids...
      </div>
    );
  }

  const bids = data?.data?.data || [];

  const userCategory = Number(user?.service_category);

  const filteredBids =
    userCategory && !isNaN(userCategory)
      ? bids.filter((b) => Number(b.category_id) === userCategory)
      : [];
      console.log(filteredBids)

  return (
    <div className="bg-gray-50 flex flex-col">
      {/* 🌟 Hero Section */}
      <div className="relative bg-[#EE4E34] text-white py-16 px-6 text-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-wide"
        >
          Bid Portal — Live Bidding & Opportunities
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
      <div className="py-4 sm:py-4 max-w-7xl mx-auto w-full">
        {filteredBids.length > 0 ? (
          <div className="space-y-4">
            {filteredBids.map((bid, index) => (
              <motion.div
                key={bid.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white border border-gray-200 hover:border-[#EE4E34] transition-all duration-200 
                 flex flex-col sm:flex-row items-center justify-between rounded-xl px-4 py-3 shadow-sm hover:shadow-md"
              >
                {/* Left Section */}
                <div className="flex items-center gap-4 flex-1 w-full">
                  <img
                    src={bid.category?.image || "/default-bid.jpg"}
                    alt={bid.title}
                    className="w-28 h-28 object-cover rounded-lg border border-gray-200"
                  />

                  <div className="flex flex-col">
                    <h3 className="text-xl font-semibold text-[#EE4E34]">
                      {bid.title}
                    </h3>
                    <p className="text-gray-700">
                      Category:{" "}
                      <span className="font-medium">
                        {bid.category?.name || "General"}
                      </span>
                    </p>
                    <p className="text-[15px] text-gray-600 mt-1">
                      <span className="font-semibold">Starts:</span>{" "}
                      {new Date(bid.bid_date).toLocaleDateString()} at{" "}
                      {bid.start_time}{" "}
                      <span className="mx-2 text-gray-400">|</span>
                      <span className="font-semibold">Ends:</span>{" "}
                      {new Date(bid.bid_end_date).toLocaleDateString()} at{" "}
                      {bid.end_time}
                    </p>

                    {/* Highlighted Bidding Info */}
                    <div className="mt-2 space-y-1">
                      <p className="text-base">
                        🏆{" "}
                        <span className="font-semibold text-gray-600">
                          Top Bidder:
                        </span>{" "}
                        <Tag color="gold">
                          {bid.top_bidder?.name || "No bids yet"}
                        </Tag>
                      </p>
                      {bid.user_bid_amount && (
                        <p className="text-base">
                          💸 <span className="font-semibold">Your Bid:</span>{" "}
                          <Tag color="green">₹{bid.user_bid_amount}</Tag>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-row sm:flex-col gap-2 mt-3 sm:mt-0 sm:ml-4">
                  <p className="text-orange-700 text-sm font-medium">
                    Min. Bid Amount: 200
                  </p>
                  <Button
                    icon={<FaGavel />}
                    type="primary"
                    className="bg-[#EE4E34] hover:bg-[#134a4b] rounded-lg text-sm px-4 font-semibold"
                    onClick={() => handleOpen(bid, "add")}
                  >
                    Place Bid
                  </Button>
                  <Button
                    icon={<FaGavel />}
                    type="default"
                    className="border border-[#EE4E34] text-[#EE4E34] hover:bg-[#134a4b] hover:text-white rounded-lg text-sm px-4 font-semibold"
                    onClick={() => handleOpen(bid, "edit")}
                    disabled={!bid.user_bid_amount}
                  >
                    Edit Bid
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
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

      {/* 💰 Universal Bid Modal */}
      <Modal
        title={
          <span className="text-[#EE4E34] font-semibold text-lg">
            {mode === "add" ? "Place New Bid" : "Edit Your Bid"} for “
            {selectedBid?.title || "N/A"}”
          </span>
        }
        open={open}
        onOk={handleSubmit}
        onCancel={() => setOpen(false)}
        okText={
          placingBid || updatingBid
            ? "Submitting..."
            : mode === "add"
            ? "Place Bid"
            : "Update Bid"
        }
        cancelText="Cancel"
        okButtonProps={{
          className: "bg-[#EE4E34] hover:bg-[#134a4b] rounded-md",
          loading: placingBid || updatingBid,
        }}
      >
        <div className="space-y-3 mt-2">
          <p className="text-gray-600 text-sm">
            Wallet Balance:{" "}
            <span className="font-semibold text-[#EE4E34]">
              ₹{user?.wallet || 0}
            </span>
          </p>
          {selectedBid?.user_bid_amount && (
            <p className="text-gray-600 text-sm">
              Your Last Bid:{" "}
              <span className="font-semibold text-green-600">
                ₹{selectedBid.user_bid_amount}
              </span>
            </p>
          )}
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

import React, { useState, useRef } from "react";
import { Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";

import { setCredentials } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import {
  useResendOtpMutation,
  useSignupMutation,
  useVerifyOtpMutation,
} from "../../services/authApi";
import { toast } from "react-toastify";

export default function Signin() {
  const [step, setStep] = useState("form"); // form | otp
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [userID, setUserID] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  const [signup, { isLoading: signingUp }] = useSignupMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async (values) => {
    try {
      const res = await signup({
        values,
      }).unwrap();
      setEmailOrPhone(values.email_or_phone);
      if (res.user_id) {
        setUserID(res.user_id);
      }
      setStep("otp");
      toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send OTP!");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const finalOtp = otp.join("");
      if (finalOtp.length < 6) {
        return message.error("Please enter a valid 6-digit OTP!");
      }
      const res = await verifyOtp({
        email_or_phone: emailOrPhone,
        otp: finalOtp,
        user_id: userID,
      }).unwrap();
      console.log(res);
      dispatch(setCredentials(res));
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Invalid OTP!");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ email_or_phone: emailOrPhone }).unwrap();
      toast.success("OTP resent!");
    } catch (err) {
      toast.error("Failed to resend OTP!");
    }
  };

  const handleChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login/OTP Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center bg-white px-10 py-8">
        <div className="w-full max-w-screen-md border rounded-md p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Login Here
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Enter your email or phone to receive an OTP and sign in!
          </p>

          {step === "form" && (
            <Form layout="vertical" onFinish={handleSendOtp}>
              <Form.Item
                name="phone_number"
                label="Enter your Phone number"
                rules={[
                  { required: true, message: "Please enter phone number" },
                ]}
              >
                <Input placeholder="1234567890" size="large" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={signingUp}
                className="bg-[#6961AB] hover:bg-purple-800"
              >
                Send OTP
              </Button>
            </Form>
          )}

          {step === "otp" && (
            <>
              <p className="text-center text-gray-600 mb-4">
                Enter the 6-digit OTP sent to{" "}
                <span className="font-medium">{emailOrPhone}</span>
              </p>
              <div className="flex justify-between mb-6 max-w-xs mx-auto">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg border rounded-md"
                    ref={(el) => (inputRefs.current[index] = el)}
                    size="large"
                  />
                ))}
              </div>
              <div className="flex justify-between items-center max-w-xs mx-auto">
                <Button
                  onClick={handleResendOtp}
                  loading={resending}
                  type="link"
                >
                  Resend OTP
                </Button>
                <Button
                  type="primary"
                  onClick={handleVerifyOtp}
                  size="large"
                  loading={verifying}
                  className="bg-purple-700 hover:bg-purple-800 text-sm"
                >
                  Verify OTP
                </Button>
              </div>
            </>
          )}

          <div className="flex justify-center gap-2 mt-4">
            <p className="text-gray-600">Don't have an account?</p>{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#6961AB] font-medium cursor-pointer"
            >
              Sign Up
            </span>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden md:flex w-1/2 bg-[#3f2c7f] items-center justify-center text-center p-10">
        <div>
          <img
            src="/logo.png"
            alt="QuickMySlot"
            className="mx-auto mb-6 w-40 h-40 object-contain"
          />
          <h2 className="text-2xl font-semibold text-white mb-2">
            QuickmySlot
          </h2>
          <p className="text-gray-200 max-w-md">
            The Ultimate Controller for Your QuickmySlot Application.
          </p>
        </div>
      </div>
    </div>
  );
}

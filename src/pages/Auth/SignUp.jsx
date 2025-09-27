// pages/Signup.jsx
import { useState, useRef, useEffect } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useDispatch } from "react-redux";
import {
  useResendOtpMutation,
  useSignupMutation,
  useVerifyOtpMutation,
} from "../../services/authApi";
import { logout, setToken, setUser } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Password from "antd/es/input/Password";
import AvailabilityModal from "./AvailabilityModal";
import ProfileModal from "./ProfileModal";
import { useGetProfileQuery } from "../../services/profileApi";

const baseUrl = import.meta.env.VITE_BASE_URL;

const { Option } = Select;

export default function Signup() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [step, setStep] = useState("form");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [userID, setUserID] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(120);
  const timerRef = useRef(null);
  const { data: profile } = useGetProfileQuery();
  const [signup, { isLoading: signingUp }] = useSignupMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

  const dispatch = useDispatch();

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // Modal states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  const handleSignup = async (values) => {
    try {
      const response = await signup(values).unwrap();
      setEmailOrPhone(values.email || values.phone_number);

      if (response.user_id) {
        setUserID(response.user_id);
      }
      setStep("otp");
      setTimer(120); // reset timer to 30s
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Signup failed!");
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

      dispatch(setToken(res.token));
      if (!res?.user?.steps || res?.user?.steps === "1") {
        setShowProfileModal(true);
      } else if (res?.user?.steps === "2") {
        setShowAvailabilityModal(true);
      } else if (res?.user?.steps === "3") {
        // First, fetch profile with token from OTP response
        const profileResponse = await fetch(`${baseUrl}profile`, {
          headers: { Authorization: `Bearer ${res?.token}` },
        });

        if (!profileResponse.ok) {
          throw new Error("Failed to fetch profile");
        }

        const profileData = await profileResponse.json();

        // Save token only after profile success
        dispatch(setToken(res.token));
        dispatch(setUser(profileData?.data));

        toast.success("Signup successful!");
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.data?.message || err.message || "Invalid OTP!");
    }
  };

  const handleResendOtp = async () => {
    try {
      await resendOtp({ phone_number: emailOrPhone }).unwrap();
      toast.success("OTP resent!");
      setTimer(30); // reset timer to 30s
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      toast.error("Failed to resend OTP!");
    }
  };

  // Handle OTP change
  const handleChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);

      // Auto move to next box
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row min-h-screen h-full bg-white">
        {/* Left Side - Signup Form */}
        <div
          className={`
      flex-1 w-full flex flex-col items-center justify-center 
      px-4 py-6 md:px-10 md:py-8 bg-white relative
    `}
        >
          {/* Logo for mobile */}
          <div className="block md:hidden mb-6 w-full text-center">
            <img
              src="/logo1.png"
              alt="QuickMySlot"
              className="mx-auto mb-2 h-24 object-contain"
            />
            <h2 className="text-xl font-semibold text-[#EE4E34] mb-1">
              QuickMySlot
            </h2>
            <p className="text-gray-400 text-sm">
              The Ultimate Controller for Your QuickMySlot Application.
            </p>
          </div>

          <div className="w-full md:max-w-2xl rounded-md p-6 md:p-8 bg-gray-50 shadow">
            {step === "form" ? (
              <h2 className="text-md sm:text-xl md:text-2xl font-bold text-gray-800 mb-4 text-center">
                Start your journey with just one step
              </h2>
            ) : (
              <p className="text-center text-gray-500 mb-2">
                Start your journey with just one step –{" "}
                <span className="text-[#EE4E34] font-semibold">OTP!</span>
              </p>
            )}

            {step === "form" && (
              <Form form={form} layout="vertical" onFinish={handleSignup}>
                <Form.Item
                  name="phone_number"
                  label="Phone Number"
                  rules={[
                    { required: true, message: "Phone number is required" },
                    {
                      pattern: /^\d{10}$/,
                      message: "Phone number must be exactly 10 digits",
                    },
                  ]}
                >
                  <div className="flex items-center gap-2">
                    <p className="p-2 px-3 border rounded-md text-black font-medium bg-gray-200">
                      +91
                    </p>
                    <Input
                      placeholder="1234567890"
                      size="large"
                      maxLength={10}
                      minLength={10}
                      type="tel"
                      inputMode="numeric"
                      pattern="\d*"
                      className="w-full"
                      onChange={(e) => {
                        const val = e.target.value
                          .replace(/[^\d]/g, "")
                          .slice(0, 10);
                        form.setFieldsValue({ phone_number: val });
                      }}
                    />
                  </div>
                </Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  loading={signingUp}
                  className="bg-[#EE4E34] hover:bg-purple-800 mt-4"
                >
                  Continue
                </Button>
              </Form>
            )}

            {step === "otp" && (
              <div>
                <p className="text-center text-gray-600 mb-4">
                  Enter the 6-digit OTP sent to your{" "}
                  <span className="font-medium">+91 {emailOrPhone}</span>
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      maxLength={1}
                      className="w-12 h-12 text-center text-orange-600 text-lg border rounded-md"
                      ref={(el) => (inputRefs.current[index] = el)}
                      style={{ fontSize: "1.5rem" }}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center gap-2">
                  <Button
                    onClick={handleResendOtp}
                    loading={resending}
                    size="large"
                    disabled={timer > 0}
                    className="bg-[#EE4E34] text-white text-sm py-1 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                  </Button>
                  <Button
                    onClick={handleVerifyOtp}
                    size="large"
                    loading={verifying}
                    disabled={timer === 0}
                    className="bg-[#EE4E34] text-white text-sm py-1 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                  >
                    Verify OTP
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Branding (Desktop/Tablet only) */}
        <div className="hidden md:flex flex-1 h-screen bg-[#EE4E34] items-center justify-center text-center p-10">
          <div>
            <img
              src="/logo1.png"
              alt="QuickMySlot"
              className="mx-auto mb-0 h-80 object-contain"
            />
            <h2 className="text-2xl font-semibold text-white mb-2">
              QuickMySlot
            </h2>
            <p className="text-gray-200 max-w-md">
              The Ultimate Controller for Your QuickMySlot Application.
            </p>
          </div>
        </div>
      </div>

      {/* ✅ Profile Modal */}
      <ProfileModal
        visible={showProfileModal}
        onClose={() => {
          dispatch(logout());
          setShowProfileModal(false);
          navigate("/signup");
          setStep("form");
          setOtp(Array(6).fill(""));
        }}
        onNext={() => {
          setShowProfileModal(false);
          setShowAvailabilityModal(true);
        }}
        userID={userID}
      />

      {/* ✅ Availability Modal */}
      <AvailabilityModal
        visible={showAvailabilityModal}
        userID={userID}
        onClose={() => {
          dispatch(logout());
          setShowAvailabilityModal(false);
          navigate("/signup");
          setStep("form");
          setOtp(Array(6).fill(""));
        }}
      />
    </>
  );
}

// pages/Signup.jsx
import { useState, useRef } from "react";
import { Form, Input, Button, Select, message } from "antd";
import { useDispatch } from "react-redux";
import {
  useResendOtpMutation,
  useSignupMutation,
  useVerifyOtpMutation,
} from "../../services/authApi";
import { setCredentials } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Password from "antd/es/input/Password";

const { Option } = Select;

export default function Signup() {
  const [type, setType] = useState("signin");
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [step, setStep] = useState("form"); // form | otp
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [userID, setUserID] = useState("");
  const [otp, setOtp] = useState(Array(6).fill("")); // 6-digit OTP
  const inputRefs = useRef([]);

  const [signup, { isLoading: signingUp }] = useSignupMutation();
  const [verifyOtp, { isLoading: verifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: resending }] = useResendOtpMutation();

  const dispatch = useDispatch();

  const handleFormChange = (type) => {
    setType(type);
  };

  const handleSignup = async (values) => {
    try {
      const response = await signup(values).unwrap();
      setEmailOrPhone(values.email || values.phone_number);

      if (response.user_id) {
        setUserID(response.user_id);
      }
      setStep("otp");
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
      dispatch(setCredentials(res));
      toast.success("Signup successful!");
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
    <div className="flex min-h-screen h-screen">
      {/* Left side - Signup form */}
      <div
        className={`w-full md:w-1/2 overflow-y-auto h-screen flex flex-col items-center 
        ${
          type === "signin" ? "justify-center" : "justify-start"
        } bg-white px-10 py-8`}
      >
        <div className="min-w-full max-w-screen-md  border rounded-md p-8 bg-gray-50">
          <h2 className="text-3xl font-bold  text-gray-800 mb-2">
            {type === "signin" ? "Login" : "Create Account"}
          </h2>
          {type === "signin" ? (
            <p className=" text-gray-500 mb-6">
              "Get access your account to unleash your journey"{" "}
              <span className="text-purple-600">sign In!</span>
            </p>
          ) : (
            <p className=" text-gray-500 mb-6">
              Start your journey with just one step –{" "}
              <span className="text-purple-600">sign up!</span>
            </p>
          )}

          {step === "form" && (
            <Form form={form} layout="vertical" onFinish={handleSignup}>
              {type === "signup" && (
                <>
                  <Form.Item
                    name="name"
                    label="Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Your name" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, type: "email" }]}
                  >
                    <Input placeholder="example@gmail.com" size="large" />
                  </Form.Item>
                </>
              )}

              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[{ required: true }]}
              >
                <Input placeholder="1234567890" size="large" />
              </Form.Item>

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true }]}
              >
                <Input.Password placeholder="Enter password" size="large" />
              </Form.Item>
              {type === "signup" && (
                <>
                  <Form.Item
                    name="password_confirmation"
                    label="Confirm Password"
                    rules={[{ required: true }]}
                  >
                    <Input.Password
                      placeholder="Confirm password"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="services_category"
                    label="Services Category"
                    rules={[{ required: true }]}
                  >
                    <Select placeholder="Select category" size="large">
                      <Option value="salon">Salon</Option>
                      <Option value="healthcare">Healthcare</Option>
                      <Option value="spa">Spa</Option>
                      <Option value="pet_clinic">Pet Clinic</Option>
                      <Option value="automotive_car">Automotive Car</Option>
                      <Option value="retail_designer">Retail/Designer</Option>
                      <Option value="tattoo_piercing">Tattoo & Piercing</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name="location_area_services"
                    label="Location/Area Services"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Jaipur, Rajasthan" size="large" />
                  </Form.Item>
                  <Form.Item
                    name="bussiness_name"
                    label="Business Name"
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="Your business name" size="large" />
                  </Form.Item>
                </>
              )}

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={signingUp}
                className="bg-[#6961AB] hover:bg-purple-800"
              >
                {type === "signup" ? "Sign Up" : "Sign In"}
              </Button>
            </Form>
          )}

          {step === "otp" && (
            <div>
              <p className="text-center text-gray-600 mb-4">
                Enter the 6-digit OTP sent to your{" "}
                <span className="font-medium">{emailOrPhone}</span>
              </p>

              <div className="flex justify-between mb-6">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg border rounded-md"
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  onClick={handleResendOtp}
                  loading={resending}
                  type="link"
                >
                  Resend OTP
                </Button>
                <Button
                  // type="primary"
                  onClick={handleVerifyOtp}
                  size="large"
                  loading={verifying}
                  className="bg-purple-700 text-white hover:bg-purple-800 text-sm py-1"
                >
                  Verify OTP
                </Button>
              </div>
            </div>
          )}
          <div className="flex justify-center gap-2 mt-4">
            {type === "signup" ? (
              <>
                <p className="text-gray-600 text-sm">Already have account?</p>{" "}
                <span
                  onClick={() => handleFormChange("signin")}
                  className="text-[#6961AB] text-sm font-medium cursor-pointer"
                >
                  Sign In
                </span>
              </>
            ) : (
              <>
                <p className="text-gray-600 text-sm">Don't have an account?</p>{" "}
                <span
                  onClick={() => handleFormChange("signup")}
                  className="text-[#6961AB] text-sm font-medium cursor-pointer"
                >
                  Sign Up
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden md:flex fixed top-0 right-0 h-screen w-1/2 bg-[#3f2c7f] items-center justify-center text-center p-10">
        <div>
          <img
            src="/Selection.png"
            alt="QuickMySlot"
            className="mx-auto mb-4 h-40 object-contain"
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

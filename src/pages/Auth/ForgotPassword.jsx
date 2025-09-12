// pages/ForgotPassword.jsx
import { Form, Input, Button, message } from "antd";
// import { useForgotPasswordMutation } from "../../services/authApi";

export default function ForgotPassword() {
  // const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleForgot = async (values) => {
    try {
      // await forgotPassword(values).unwrap();
      // message.success("Password reset link/OTP sent!");
    } catch (err) {
      message.error("Failed to send reset instructions!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-purple-700">
          Forgot Password?
        </h2>
        <p className="text-gray-500 text-center mb-4">
          Enter your email or phone
        </p>

        <Form layout="vertical" onFinish={handleForgot}>
          <Form.Item
            name="email_or_phone"
            label="Email or Phone"
            rules={[{ required: true }]}
          >
            <Input placeholder="Enter email or phone" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full bg-purple-700 hover:bg-purple-800"
            loading={isLoading}
          >
            Send Reset Link
          </Button>
        </Form>
      </div>
    </div>
  );
}

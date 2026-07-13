import ForgotPasswordFlowLayout from "./_components/forgot-password-flow-layout";

export const metadata = {
  title: "Forgot password | Rose App",
  description: "don't worry, we will send you an email to reset your password",
}

export default function page() {
  return (
    <div>
      <ForgotPasswordFlowLayout />
    </div>
  );
}

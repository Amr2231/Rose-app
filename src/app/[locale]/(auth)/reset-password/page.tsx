import ResetPasswordForm from "./_components/reset-password-form";

export const metadata = {
  title: "Reset Password | Rose App",
  description: "Create new password after reset it",
};

type Props = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { token } = await searchParams;

  return (
    <div>
      <ResetPasswordForm token={token ?? ""} />
    </div>
  );
}

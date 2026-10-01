import AuthForm from "@/components/AuthForm";

export const metadata = { title: "Вход — dixize.store" };

export default function LoginPage() {
  return (
    <div className="auth-page">
      <AuthForm mode="login" />
    </div>
  );
}

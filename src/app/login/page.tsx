import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Student login · Sohail YouTube Academy" };

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="mx-auto w-full max-w-[440px] px-5 pt-14 pb-20">
      <LoginForm />
    </div>
  );
}

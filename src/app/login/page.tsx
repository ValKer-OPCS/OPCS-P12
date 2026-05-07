"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm/AuthForm";

const LoginPage = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ token })
        });

        const data = await res.json();

        if (data.valid) {
          router.replace("/dashboard");
          return;
        }

        localStorage.removeItem("token");
        setChecking(false);
      } catch {
        localStorage.removeItem("token");
        setChecking(false);
      }
    };

    checkToken();
  }, [router]);

  if (checking) {
    return null;
  }

  return (
    <div>
      <AuthForm />
    </div>
  );
};

export default LoginPage;
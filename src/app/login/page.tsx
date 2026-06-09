"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm/AuthForm";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const router = useRouter();
  const { token, setToken, loaded } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loaded) return;
    const checkToken = async () => {
      if (!token) {
        setChecking(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (data.valid) {
          router.replace("/dashboard");
          return;
        }

        setToken(null);
        setChecking(false);
      } catch {
        setToken(null);
        setChecking(false);
      }
    };

    checkToken();
  }, [loaded, token, router, setToken]);

  if (!loaded || checking) return null;

  return <AuthForm />;
};

export default LoginPage;

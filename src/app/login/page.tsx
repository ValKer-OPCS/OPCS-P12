"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm/AuthForm";

const LoginPage = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            router.replace("/dashboard");
            return;
          }
        }
      } catch {}

      setChecking(false);
    };

    checkAuth();
  }, [router]);

  if (checking) return null;

  return <AuthForm />;
};

export default LoginPage;

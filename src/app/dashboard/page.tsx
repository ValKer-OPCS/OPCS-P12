"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import DashboardProject from '@/containers/DashboardProject/DashboardProject'

const DashboardPage = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const { token, setToken } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {

      if (!token) {
        router.replace("/login");
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

        if (!data.valid) {
          localStorage.removeItem("token");
          setToken(null);
          router.replace("/login");
          return;
        }

        setChecking(false);
      } catch {
        localStorage.removeItem("token");
        setToken(null);
        router.replace("/login");
      }
    };

    verifyToken();
  }, [token, router, setToken]);

  if (checking) {
    return null;
  }

  return (
    <div>


      <DashboardProject />



    </div>
  )
};

export default DashboardPage;
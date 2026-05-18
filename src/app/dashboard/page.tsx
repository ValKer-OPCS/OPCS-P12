"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardProject from '@/containers/DashboardProject/DashboardProject'

const DashboardPage = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");

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
          router.replace("/login");
          return;
        }

        setChecking(false);
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    verifyToken();
  }, [router]);

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
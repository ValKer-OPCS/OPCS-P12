"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import DashboardProject from "@/containers/DashboardProject/DashboardProject";

const DashboardPage = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();

        if (!data.authenticated) {
          router.replace("/login");
          return;
        }

        setChecking(false);
      } catch {
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router]);

  if (checking) return null;

  return (
    <div>
      <DashboardProject />
    </div>
  );
};

export default DashboardPage;

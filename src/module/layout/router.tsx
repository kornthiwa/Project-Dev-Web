"use client";

import { usePathname, useRouter } from "next/navigation";
import Layout from "./layout";
import { useEffect, useState } from "react";

export default function MyRouter({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // เมื่อหน้า login โหลดครั้งแรก ตรวจสอบว่ามีข้อมูลผู้ใช้ใน local storage หรือไม่
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/login");
    }
  }, [router]);

  console.log(pathname);

  return <>{pathname === "/login" ? children : <Layout>{children}</Layout>}</>;
}

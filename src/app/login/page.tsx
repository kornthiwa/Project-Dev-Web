"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/module/axios";

interface User {
  access_token: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // เมื่อหน้า login โหลดครั้งแรก ตรวจสอบว่ามีข้อมูลผู้ใช้ใน local storage หรือไม่
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user: User = JSON.parse(userStr);
      if (user && user.access_token) {
        // ถ้ามีข้อมูลผู้ใช้ใน local storage และมี access_token ให้เปลี่ยนเส้นทางไปยังหน้าหลัก
        router.push("/");
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post<User>("auth/login", {
        username,
        password,
      });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data));

        router.push("/"); // ส่งผ่านรหัสที่คุณต้องการไปยังหน้าแรก
      } else {
        // Handle authentication errors
        console.error("Authentication failed");
      }
    } catch (error) {
      // Handle network errors or other issues
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

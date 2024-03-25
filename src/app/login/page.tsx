"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { axiosInstance } from "@/module/axios";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme } from "@mui/material/styles";
import DialogAddUser from "./register";

interface User {
  access_token: string;
}

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function LoginPage() {
  const [open, setOpen] = useState(false);
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
    if (!username || !password) {
      // ถ้ามีช่องว่าง ให้ไม่ส่งคำขอ axios และแสดงข้อความเตือน
      alert("Username and password are required");
      return;
    }
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h6">
            ระบบการเรียกคิวในสถานพยาบาลขนาดเล็ก
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              id="email"
              label="Username"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2" onClick={() => setOpen(true)}>
                  สมัครสมาชิก
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2"></Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <DialogAddUser open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

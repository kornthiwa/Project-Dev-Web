"use client";
import React, { useState } from "react";
import { Tab, Tabs, Box, Typography } from "@mui/material";
import Patient from "./table/patient";
import Queue from "./table/queue";
import Doctor from "./table/doctor";
import Medical from "./table/medical";
import Appointment from "./table/appointment";
import User from "./table/user";
import { useRouter } from "next/navigation";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface User {
  access_token: string;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
};

const MyTabs: React.FC = () => {
  const [value, setValue] = useState<number>(0);
  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const userStr = localStorage.getItem("user");
  let userRole = "";

  if (userStr) {
    const user = JSON.parse(userStr);
    if (user && user.user.role) {
      userRole = user.user.role;
    }
  }
  console.log(userRole);

  return (
    <div>
      <Tabs value={value} onChange={handleChange} aria-label="Tabs example">
        <Tab label="ข้อมูลผู้ป้วย" />
        <Tab label="ข้อมูลคิว" />
        <Tab label="ข้อมูลหมอ" />
        {/* <Tab label="ข้อมูลประวัติการรักษา" /> */}
        <Tab label="ข้อมูลการนัดหมาย" />
        {userRole === "ADMIN" && <Tab label="ข้อมูลUser" />}
      </Tabs>
      <TabPanel value={value} index={0}>
        <Patient />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Queue />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Doctor />
      </TabPanel>
      {/* <TabPanel value={value} index={3}>
        <Medical />
      </TabPanel> */}
      <TabPanel value={value} index={3}>
        <Appointment />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <User />
      </TabPanel>
    </div>
  );
};

export default MyTabs;

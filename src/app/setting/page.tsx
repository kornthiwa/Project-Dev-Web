"use client";
import React, { useState } from "react";
import { Tab, Tabs, Box, Typography } from "@mui/material";
import Patient from "./table/patient";
import Queue from "./table/queue";
import Doctor from "./table/doctor";
import Medical from "./table/medical";
import Appointment from "./table/appointment";
import User from "./table/user";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange} aria-label="Tabs example">
        <Tab label="ข้อมูลผู้ป้วย" />
        <Tab label="ข้อมูลคิว" />
        <Tab label="ข้อมูลหมอ" />
        {/* <Tab label="ข้อมูลประวัติการรักษา" /> */}
        <Tab label="ข้อมูลการนัดหมาย" />
        <Tab label="ข้อมูลUser" />
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

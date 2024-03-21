"use client";
import { axiosInstance } from "@/module/axios";
import { Grid } from "@mui/material";
// components/MyLineCharts.tsx
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
  ArcElement,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useQuery } from "react-query";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ArcElement
);

const MyLineCharts = () => {
  const { data: dataAPI } = useQuery<any>({
    queryKey: ["queue"],
    queryFn: async () => {
      const response = await axiosInstance.get(`queue/count-per-day`);
      return response.data;
    },
  });

  const { data: dataAPI2 } = useQuery<any>({
    queryKey: ["patient"],
    queryFn: async () => {
      const response = await axiosInstance.get(`patient/sample-data`);
      return response.data;
    },
  });

  // ตรวจสอบว่า dataAPI มีค่าหรือไม่ก่อนที่จะใช้งาน Object.keys และ Object.values
  if (!dataAPI || !dataAPI2) {
    return <div>Loading...</div>;
  }
  return (
    <Grid container>
      <Grid item xs={6}>
        <h2>จำนวนผู้ใช้งาน </h2>
        <div style={{ width: "500px", height: "500px" }}>
          <Line
            data={{
              labels: Object.keys(dataAPI), // ใช้ keys ของ object เป็น labels

              datasets: [
                {
                  data: Object.values(dataAPI), // ใช้ values ของ object เป็นข้อมูลใน datasets
                  backgroundColor: "purple",
                },
              ],
            }}
          />
        </div>
      </Grid>

      <Grid item xs={6}>
        <h2></h2>
        <div style={{ width: "500px", height: "500px" }}>
          <Doughnut
            data={{
              labels: Object.keys(dataAPI2),
              datasets: [
                {
                  label: "# of Votes",
                  data: Object.values(dataAPI2),
                  backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                  ],
                  borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                  ],
                  borderWidth: 1,
                },
              ],
            }}
          />
        </div>
      </Grid>
    </Grid>
  );
};

export default MyLineCharts;

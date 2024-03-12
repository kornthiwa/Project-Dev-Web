"use client";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  ArcElement
);

const MyLineCharts = () => {
  return (
    <Grid container>
      <Grid item xs={6}>
        <h2>Line Chart 1</h2>
        <Line
          data={{
            labels: [
              "2023-01",
              "2023-02",
              "2023-03",
              "2023-04",
              "2023-05",
              "2023-06",
              "2023-07",
            ],
            datasets: [
              {
                data: [100, 120, 115, 134, 168, 132, 200],
                backgroundColor: "purple",
              },
            ],
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <h2>Doughnut Chart</h2>
        <Doughnut
          data={{
            labels: ["Red", "Blue", "Yellow", "Green", "Purple"],
            datasets: [
              {
                label: "# of Votes",
                data: [12, 19, 3, 5, 2],
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
      </Grid>
    </Grid>
  );
};

export default MyLineCharts;

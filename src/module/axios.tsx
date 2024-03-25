import axios from "axios";

// สร้าง Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
// const axiosInstance = axios.create({
//   baseURL: "https://jolly-toad-cummerbund.cyclic.app/",
//   timeout: 5000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// ฟังก์ชันสำหรับการแนบ token ใน header
const attachToken = (token: string) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

export { axiosInstance, attachToken };

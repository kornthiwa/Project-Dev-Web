import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Autocomplete, InputLabel, MenuItem, Select } from "@mui/material";

import { useMutation, useQuery } from "react-query";
import { axiosInstance } from "@/module/axios";

interface DialogPatientProps {
  open: boolean;
  onClose: () => void;
}

const validationSchema = yup.object().shape({
  username: yup.string().required("กรุณากรอกชื่อผู้ใช้"),
  password: yup
    .string()
    .required("กรุณากรอกรหัสผ่าน")
    .min(6, "รหัสผ่านต้องมีอย่างน้อย 6 ตัว"),
  name: yup.string().required("กรุณากรอกชื่อ"),
  lname: yup.string().required("กรุณากรอกนามสกุล"),
  role: yup.string().required("กรุณาเลือกบทบาท"),
  department: yup.string().required("กรุณาเลือกแผนก"),
});

const postqueue = async (values: any): Promise<any> => {
  console.log(values);

  try {
    const response = await axiosInstance.post("login/register", values);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const DialogAddUser: React.FC<DialogPatientProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    lname: "",
    role: "",
    department: "",
    rememberMe: false,
  });

  const { mutate: queue } = useMutation<any, any, any>(
    (data: any) => postqueue(data),
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(["patients"]);
      },
      onError: (error) => {
        console.error("Error occurred:", error);
        alert("เกิดข้อผิดพลาด: " + error.response.data.message); // แสดง alert หรือเปลี่ยนการแจ้งเตือนตามต้องการ
      },
    }
  );

  const formik = useFormik({
    initialValues: formData,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      queue(values);
      onClose();
    },
  });

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>สมัครสมาชิก</DialogTitle>
        <form id="patient-form" onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <InputLabel id="username" sx={{ marginBottom: "8px" }}>
              ชื่อผู้ใช้
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="username"
              name="username"
              type="text"
              fullWidth
              value={formik.values.username}
              onChange={formik.handleChange}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
            />
            <InputLabel id="password" sx={{ marginBottom: "8px" }}>
              รหัสผ่าน
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="password"
              name="password"
              type="password"
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <InputLabel id="name" sx={{ marginBottom: "8px" }}>
              ชื่อ
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              type="text"
              fullWidth
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <InputLabel id="lname" sx={{ marginBottom: "8px" }}>
              นามสกุล
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="lname"
              name="lname"
              type="text"
              fullWidth
              value={formik.values.lname}
              onChange={formik.handleChange}
              error={formik.touched.lname && Boolean(formik.errors.lname)}
              helperText={formik.touched.lname && formik.errors.lname}
            />
            <InputLabel id="role" sx={{ marginBottom: "8px" }}>
              บทบาท
            </InputLabel>
            <Select
              labelId="role"
              id="role"
              name="role"
              placeholder="เลือก"
              value={formik.values.role}
              onChange={formik.handleChange}
              error={formik.touched.role && Boolean(formik.errors.role)}
              fullWidth
            >
              <MenuItem value="ADMIN">ผู้ดูแลระบบ</MenuItem>
              <MenuItem value="NURSE">พยาบาล</MenuItem>
              <MenuItem value="DOCTOR">แพทย์</MenuItem>
            </Select>

            <InputLabel id="department" sx={{ marginBottom: "8px" }}>
              แผนก
            </InputLabel>
            <Select
              labelId="department"
              id="department"
              name="department"
              placeholder="เลือก"
              value={formik.values.department}
              onChange={formik.handleChange}
              error={
                formik.touched.department && Boolean(formik.errors.department)
              }
              fullWidth
            >
              <MenuItem value="CARDIOLOGY">อายุรกรรมโรคหัวใจ</MenuItem>
              <MenuItem value="ONCOLOGY">อายุรกรรมโรคมะเร็ง</MenuItem>
              <MenuItem value="HR">ทรัพยากรบุคคล</MenuItem>
              <MenuItem value="IT">เทคโนโลยีสารสนเทศ</MenuItem>
              <MenuItem value="ADMINISTRATION">แผนกธุรการ</MenuItem>
              <MenuItem value="EXAMINATION_ROOM">ห้องตรวจ</MenuItem>
              <MenuItem value="REFERRAL">แผนกส่งตัว</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>ยกเลิก</Button>
            <Button type="submit">บันทึก</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogAddUser;

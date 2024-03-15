import * as React from "react";
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
  name: yup.string().required("กรุณากรอกชื่อแพทย์"),
  position: yup.string().required("กรุณาระบุตำแหน่งของแพทย์"),
  education: yup.string().required("กรุณาระบุวุฒิการศึกษาของแพทย์"),
  phoneNumber: yup.string().required("กรุณาระบุเบอร์โทรศัพท์ของแพทย์"),
  department: yup.string().required("กรุณาระบุแผนกของแพทย์"),
  email: yup
    .string()
    .email("รูปแบบอีเมลไม่ถูกต้อง")
    .required("กรุณาระบุอีเมลของแพทย์"),
});

const postqueue = async (values: any): Promise<any> => {
  console.log(values);

  try {
    const response = await axiosInstance.post("doctor", values);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const DialogAddDoctor: React.FC<DialogPatientProps> = ({ open, onClose }) => {
  const { mutate: queue } = useMutation<any, any, any>(
    (data: any) => postqueue(data),
    {
      onSuccess: () => {
        console.log("Edit Success ID:");
        // queryClient.invalidateQueries(["patients"]);
      },
    }
  );

  // Use CreateDoctorDto for initialValues
  const formik = useFormik({
    initialValues: {
      name: "",
      position: "",
      education: "",
      experience: "", // สามารถกำหนดค่าให้ตามต้องการ
      phoneNumber: "", // สามารถกำหนดค่าให้ตามต้องการ
      email: "", // สามารถกำหนดค่าให้ตามต้องการ
      department: "",
      workingHours: [], // สามารถกำหนดค่าให้ตามต้องการ
    },
    validationSchema: validationSchema, // Use validation schema
    onSubmit: (values) => {
      queue(values);
      console.log(values);
      onClose();
    },
  });

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>เพิ่มข้อมูลหมอ</DialogTitle>
        <form id="patient-form" onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <InputLabel id="name" sx={{ marginBottom: "8px" }}>
              ชื่อ - สกุล
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
            <InputLabel id="phoneNumber" sx={{ marginBottom: "8px" }}>
              เบอร์โทร
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              fullWidth
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />{" "}
            <InputLabel id="email" sx={{ marginBottom: "8px" }}>
              เมล์
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              name="email"
              type="text"
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <InputLabel id="position" sx={{ marginBottom: "8px" }}>
              ตำแหน่ง
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="position"
              name="position"
              type="text"
              fullWidth
              value={formik.values.position}
              onChange={formik.handleChange}
              error={formik.touched.position && Boolean(formik.errors.position)}
              helperText={formik.touched.position && formik.errors.position}
            />
            <InputLabel id="education" sx={{ marginBottom: "8px" }}>
              การศึกษา
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="education"
              name="education"
              type="text"
              fullWidth
              value={formik.values.education}
              onChange={formik.handleChange}
              error={
                formik.touched.education && Boolean(formik.errors.education)
              }
              helperText={formik.touched.education && formik.errors.education}
            />
            <InputLabel id="department" sx={{ marginBottom: "8px" }}>
              แผนก
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="department"
              name="department"
              type="text"
              fullWidth
              value={formik.values.department}
              onChange={formik.handleChange}
              error={
                formik.touched.department && Boolean(formik.errors.department)
              }
              helperText={formik.touched.department && formik.errors.department}
            />
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

export default DialogAddDoctor;

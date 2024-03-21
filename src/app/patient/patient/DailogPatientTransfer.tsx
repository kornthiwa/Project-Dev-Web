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

import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosInstance } from "@/module/axios";

interface DialogPatientProps {
  open: boolean;
  onClose: () => void;
  patient: any;
}

interface FormData {
  symptoms: string;
  clinic: string;
  doctor: string | { id: string };
  walking: string;
}

const validationSchema = yup.object({
  symptoms: yup.string().required("กรอกข้อมูล"),
  clinic: yup.string().required("เลือก"),
  doctor: yup.object().required("เลือก"),
  walking: yup.string().required("เลือก"),
});
const fetchDoctors = async () => {
  const response = await axiosInstance.get("doctor");
  return response.data;
};

const postqueue = async (values: any): Promise<any> => {
  console.log(values);

  try {
    const patient = await axiosInstance.patch(`patient/${values.patient}`, {
      status: "queue",
    });
    const response = await axiosInstance.post("queue", values);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const DialogPatientTransfer: React.FC<DialogPatientProps> = ({
  open,
  onClose,
  patient,
}) => {
  const queryClient = useQueryClient();

  const {
    data: doctors = [],
    isLoading,
    isError,
  } = useQuery("doctors", fetchDoctors);

  const { mutate: queue } = useMutation<any, any, any>(
    (data: any) => postqueue(data),
    {
      onSuccess: () => {
        // queryClient.invalidateQueries(["patients"]);
        queryClient.invalidateQueries(["patients"]);
      },
    }
  );
  const formik = useFormik({
    initialValues: {
      symptoms: "",
      clinic: "",
      doctor: "",
      walking: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values: FormData) => {
      const id =
        values.doctor && typeof values.doctor === "object"
          ? values.doctor.id
          : values.doctor;
      const paylord: any = {
        patient: patient._id,
        doctor: id,
        clinic: values.clinic,
        walking: values.walking,
        symptoms: values.symptoms,
      };
      queue(paylord);

      onClose();
    },
  });

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>ส่งตัวผู้ป่วยเข้ารับการรักษา</DialogTitle>
        <form id="patient-form" onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText></DialogContentText>
            <InputLabel id="1" sx={{ marginBottom: "8px" }}>
              แพทย์
            </InputLabel>
            <Autocomplete
              options={
                doctors.map((doctor: any) => ({
                  id: doctor._id,
                  name: doctor.name,
                })) || []
              }
              getOptionLabel={(option: any) => option?.name || ""}
              value={formik.values.doctor}
              onChange={(event, newValue) => {
                formik.setFieldValue("doctor", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  margin="dense"
                  id="doctor"
                  name="doctor"
                  fullWidth
                  error={formik.touched.doctor && Boolean(formik.errors.doctor)}
                />
              )}
            />

            <InputLabel id="walking" sx={{ marginBottom: "8px" }}>
              เคลื่อนย้าย
            </InputLabel>
            <Select
              labelId="walking"
              id="walking"
              value={formik.values.walking}
              placeholder="เลือก"
              onChange={(e) => formik.setFieldValue("walking", e.target.value)}
              fullWidth
              error={formik.touched.walking && Boolean(formik.errors.walking)}
            >
              <MenuItem value="walking">เดิน</MenuItem>
              <MenuItem value="lyingDown">เปลนอน</MenuItem>
              <MenuItem value="wheelchair">รถเข็น</MenuItem>
            </Select>
            <InputLabel id="clinic" sx={{ marginBottom: "8px" }}>
              คลินิก
            </InputLabel>
            <Select
              labelId="clinic"
              id="clinic"
              name="clinic"
              value={formik.values.clinic}
              onChange={formik.handleChange}
              error={formik.touched.clinic && Boolean(formik.errors.clinic)}
              fullWidth
            >
              <MenuItem value="general">คลินิกทั่วไป</MenuItem>
              <MenuItem value="pediatrics">คลินิกกุมารเวชศาสตร์</MenuItem>
              <MenuItem value="dentistry">คลินิกทันตกรรม</MenuItem>
              <MenuItem value="dermatology">คลินิกผิวหนัง</MenuItem>
              <MenuItem value="ophthalmology">คลินิกตา</MenuItem>
            </Select>
            <InputLabel id="symptoms" sx={{ marginBottom: "8px" }}>
              อาการ
            </InputLabel>
            <TextField
              autoFocus
              margin="dense"
              id="symptoms"
              name="symptoms"
              label="อาการ"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={formik.values.symptoms}
              onChange={formik.handleChange}
              error={formik.touched.symptoms && Boolean(formik.errors.symptoms)}
              helperText={formik.touched.symptoms && formik.errors.symptoms}
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

export default DialogPatientTransfer;

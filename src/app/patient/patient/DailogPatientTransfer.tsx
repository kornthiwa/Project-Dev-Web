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
import { Autocomplete, MenuItem, Select } from "@mui/material";

import { useMutation, useQuery } from "react-query";
import { axiosInstance } from "@/module/axios";

interface DialogPatientProps {
  open: boolean;
  onClose: () => void;
  patient: any;
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
  const {
    data: doctors = [],
    isLoading,
    isError,
  } = useQuery("doctors", fetchDoctors);

  const { mutate: queue } = useMutation<any, any, any>(
    (data: any) => postqueue(data),
    {
      onSuccess: () => {
        console.log("Edit Success ID:");
        // queryClient.invalidateQueries(["patients"]);
      },
    }
  );
  const formik = useFormik({
    initialValues: {
      symptoms: "",
      clinic: "",
      doctor: { name: "", id: "" },
      walking: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const paylord: any = {
        patient: patient._id,
        doctor: values.doctor.id,
        clinic: values.clinic,
        walking: values.walking,
        symptoms: values.symptoms,
      };
      queue(paylord);

      console.log(paylord);
      onClose();
    },
  });

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>ส่งตัวผู้ป่วยเข้ารับการรักษา</DialogTitle>
        <form id="patient-form" onSubmit={formik.handleSubmit}>
          <DialogContent>
            <DialogContentText></DialogContentText>
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
                  label="แพทย์"
                  fullWidth
                  variant="standard"
                  error={formik.touched.doctor && Boolean(formik.errors.doctor)}
                />
              )}
            />
            <Select
              labelId="walking"
              id="walking"
              name="walking"
              value={formik.values.walking}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.walking && Boolean(formik.errors.walking)}
              fullWidth
            >
              <MenuItem value="">เลือก</MenuItem>
              <MenuItem value="walking">เดิน</MenuItem>
              <MenuItem value="lyingDown">นอน</MenuItem>
              <MenuItem value="wheelchair">รถเข็น</MenuItem>
            </Select>
            <Select
              labelId="clinic-label"
              id="clinic"
              name="clinic"
              value={formik.values.clinic}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.clinic && Boolean(formik.errors.clinic)}
              fullWidth
            >
              <MenuItem value="">เลือก</MenuItem>
              <MenuItem value="walking">เดิน</MenuItem>
              <MenuItem value="lyingDown">นอน</MenuItem>
              <MenuItem value="wheelchair">รถเข็น</MenuItem>
            </Select>

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
              variant="standard"
              value={formik.values.symptoms}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
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

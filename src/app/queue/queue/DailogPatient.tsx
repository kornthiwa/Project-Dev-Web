import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Grid,
  InputAdornment,
  InputLabel,
  List,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as yup from "yup";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { useFormik } from "formik";
import { axiosInstance } from "@/module/axios";

interface DialogPatientProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  dataDoctor: any;
  view: boolean;
  dataPatient?: any;
  eidit?: boolean;
}

const validationSchema = yup.object({
  bodyTemperature: yup.number().required("กรุณากรอกอุณหภูมิร่างกาย"),
  weight: yup.number().required("กรุณากรอกน้ำหนัก"),
  height: yup.number().required("กรุณากรอกส่วนสูง"),
  bloodPressure: yup.string().required("กรุณากรอกความดันโลหิต"),
  treatmentDetails: yup.string().required("กรุณากรอกรายละเอียดการรักษา"),
  diagnosis: yup.string().required("กรุณากรอกผลการตรวจวินิจฉัย"),
  prescription: yup.string().required("กรุณากรอกสั่งยา"),
});

const DialogPatient: React.FC<DialogPatientProps> = ({
  open,
  onClose,
  onSave,
  dataDoctor,
  dataPatient,
  view,
  eidit,
}) => {
  const queryClient = useQueryClient();
  const [error, setError] = React.useState();
  const [menuopen, setMenuOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<any>();

  const addTemperature = async (values: any): Promise<any> => {
    console.log(values);
    const paylord: any = {
      doctor: values.doctor,
      patient: values.patient,
      bodyTemperature: values.bodyTemperature,
      weight: values.weight,
      height: values.height,
      bloodPressure: values.bloodPressure,
      treatmentDetails: values.treatmentDetails,
      diagnosis: values.diagnosis,
      appointmentDate: values.appointmentDate,
      prescription: values.prescription,
    };

    try {
      if (menuopen) {
        await axiosInstance.post(`appointment`, paylord);
      }
      await axiosInstance.post("medical", paylord);
      await axiosInstance.post("queue/status", dataPatient);
    } catch (error) {
      console.error("Error updating todo list:", error);
      throw error;
    }
  };

  const { mutate: addDataTemperature } = useMutation<any, any, any>(
    (data: any) => addTemperature(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["patients"]);
      },
    }
  );

  const formik = useFormik({
    initialValues: {
      doctor: dataDoctor,
      patient: dataPatient.patient,
      bodyTemperature: "",
      weight: "",
      height: "",
      bloodPressure: "",
      treatmentDetails: "",
      diagnosis: "",
      appointmentDate: new Date(),
      prescription: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await addDataTemperature(values);
        onSave();
      } catch (error) {}
    },
  });

  const handleDateChange = (date: any) => {
    setSelectedDate(date);
    formik.setFieldValue("appointmentDate", date);
  };

  return (
    <React.Fragment>
      <Dialog open={open} fullWidth maxWidth="lg">
        <DialogTitle>เพิ่มผู้ป่วยเข้ารับการรักษา</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <form id="patient-form" onSubmit={formik.handleSubmit}>
            <Grid container>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label" sx={{ marginBottom: "8px" }}>
                  คำนำหน้า
                </InputLabel>
              </Grid>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">
                  ชื่อ{dataPatient.name}
                </InputLabel>
              </Grid>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">นามสกุล</InputLabel>
              </Grid>
              <Grid item xs={3} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">อุณหภูมิร่างกาย</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="bodyTemperature"
                  name="bodyTemperature"
                  type="number"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.bodyTemperature}
                  onChange={formik.handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">°C</InputAdornment>
                    ),
                  }}
                  error={
                    formik.touched.bodyTemperature &&
                    Boolean(formik.errors.bodyTemperature)
                  }
                  helperText={
                    formik.touched.bodyTemperature &&
                    formik.errors.bodyTemperature
                  }
                />
              </Grid>
              <Grid item xs={3} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">น้ำหนัก</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="weight"
                  name="weight"
                  type="number"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.weight}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setError(undefined);
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                  error={
                    (formik.touched.weight && Boolean(formik.errors.weight)) ||
                    error
                  }
                  helperText={
                    (formik.touched.weight && formik.errors.weight) || error
                  }
                />
              </Grid>{" "}
              <Grid item xs={3} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">ส่วนสูง</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="height"
                  name="height"
                  type="number"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.height}
                  onChange={formik.handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">cm</InputAdornment>
                    ),
                  }}
                  error={formik.touched.height && Boolean(formik.errors.height)}
                  helperText={formik.touched.height && formik.errors.height}
                />
              </Grid>{" "}
              <Grid item xs={3} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">ความดันโลหิต</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="bloodPressure"
                  name="bloodPressure"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.bloodPressure}
                  onChange={formik.handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">mmHg</InputAdornment>
                    ),
                  }}
                  error={
                    formik.touched.bloodPressure &&
                    Boolean(formik.errors.bloodPressure)
                  }
                  helperText={
                    formik.touched.bloodPressure && formik.errors.bloodPressure
                  }
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">รายละเอียดของการรักษา</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="treatmentDetails"
                  name="treatmentDetails"
                  type="text"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formik.values.treatmentDetails}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.treatmentDetails &&
                    Boolean(formik.errors.treatmentDetails)
                  }
                  helperText={
                    formik.touched.treatmentDetails &&
                    formik.errors.treatmentDetails
                  }
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">ผลการตรวจวินิจฉัย</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="diagnosis"
                  name="diagnosis"
                  type="text"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formik.values.diagnosis}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.diagnosis && Boolean(formik.errors.diagnosis)
                  }
                  helperText={
                    formik.touched.diagnosis && formik.errors.diagnosis
                  }
                />
              </Grid>
              <Grid item xs={12} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">การสั่งยา</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="prescription"
                  name="prescription"
                  type="text"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={4}
                  value={formik.values.prescription}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.prescription &&
                    Boolean(formik.errors.prescription)
                  }
                  helperText={
                    formik.touched.prescription && formik.errors.prescription
                  }
                />
              </Grid>
            </Grid>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={menuopen}
                    onChange={() => setMenuOpen(!menuopen)}
                    value="checked"
                  />
                }
                label="นัดเข้ารับการรักษา"
              />
            </FormGroup>

            <Collapse in={menuopen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Grid container>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      disablePast
                      value={selectedDate}
                      onChange={handleDateChange}
                    />
                  </LocalizationProvider>
                </Grid>
              </List>
            </Collapse>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button type="submit" form="patient-form">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogPatient;

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Grid, InputLabel, MenuItem, Select } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect } from "react";
import axios, { AxiosResponse } from "axios";
// import {
//   useMutation,
//   UseMutationOptions,
//   useQueryClient,
// } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "react-query";

interface DialogPatientProps {
  open: boolean;
  onClose: () => void;
  view: boolean;
  dataPatient?: FormValues;
  eidit?: boolean;
}

interface FormValues {
  _id?: string;
  nametitle: string;
  name: string;
  lastName: string;
  age: string;
  phoneNumber: string;
  emergencyContact: string;
  citizenid: string;
  race: string;
  nationality: string;
  address: string;
  allergicMedicine: string;
  symptoms: string;
}

const validationSchema = yup.object({
  name: yup.string().required("กรุณากรอกชื่อ"),
  nametitle: yup.string().required("กรุณาเลือก"),
  lastName: yup.string().required("กรุณากรอกนามสกุล"),
  age: yup.number().required("กรุณากรอกอายุ").positive("อายุต้องเป็นเลขบวก"),
  phoneNumber: yup
    .string()
    .required("กรุณากรอกเบอร์โทรศัพท์")
    .matches(/^[0-9]+$/, "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้น"),
  emergencyContact: yup
    .string()
    .required("กรุณากรอกเบอร์ติดต่อฉุกเฉิน")
    .matches(/^[0-9]+$/, "เบอร์ติดต่อฉุกเฉินต้องเป็นตัวเลขเท่านั้น"),
  citizenid: yup.string().required("กรุณากรอกเลขบัตรประชาชน"),
  race: yup.string().required("กรุณากรอกเชื้อชาติ"),
  nationality: yup.string().required("กรุณากรอกสัญชาติ"),
  address: yup.string().required("กรุณากรอกที่อยู่"),
  allergicMedicine: yup.string(),
  symptoms: yup.string(),
});

const DialogPatient: React.FC<DialogPatientProps> = ({
  open,
  onClose,
  dataPatient,
  view,
  eidit,
}) => {
  const queryClient = useQueryClient();
  const [error, setError] = React.useState();

  const editData = async (values: FormValues): Promise<any> => {
    console.log(values);
    const paylord: FormValues = {
      nametitle: values.nametitle,
      name: values.name,
      lastName: values.lastName,
      age: values.age,
      phoneNumber: values.phoneNumber,
      emergencyContact: values.emergencyContact,
      citizenid: values.citizenid,
      race: values.race,
      nationality: values.nationality,
      address: values.address,
      allergicMedicine: values.allergicMedicine,
      symptoms: values.symptoms,
    };
    try {
      if (eidit) {
        const response = await axios.patch(
          `http://localhost:8080/patient/${values._id}`,
          values
        );
        return response.data;
      } else {
        const response = await axios.post(
          "http://localhost:8080/patient",
          paylord
        );
        return response.data;
      }
    } catch (error) {
      console.error("Error updating todo list:", error);
      throw error;
    }
  };

  const { mutate: editPatients } = useMutation<FormValues, any, FormValues>(
    (data: FormValues) => editData(data),
    {
      onSuccess: () => {
        console.log("Edit Success ID:");
        queryClient.invalidateQueries(["patients"]);
      },
    }
  );

  // const mutation = useMutation(
  //   async (values: any) => {
  //     if (eidit) {
  //       return axios.patch(
  //         `http://localhost:8080/patient/${values._id}`,
  //         values
  //       );
  //     } else {
  //       return axios.post("http://localhost:8080/patient", values);
  //     }
  //   },
  //   {
  //     onSuccess: async () => {
  //       onClose(); // Close the dialog after successful creation
  //     },
  //     onError: (error: any) => {
  //       console.log(error.response.data.message);
  //       setError(error.response.data.message);
  //     },
  //   }
  // );

  const formik = useFormik({
    initialValues: {
      _id: "",
      nametitle: "",
      name: "",
      lastName: "",
      age: "",
      phoneNumber: "",
      emergencyContact: "",
      citizenid: "",
      race: "",
      nationality: "",
      address: "",
      allergicMedicine: "",
      symptoms: "",
    },

    validationSchema: validationSchema,
    onSubmit: async (values: FormValues) => {
      try {
        await editPatients(values);
        onClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (dataPatient) {
      formik.setValues({
        _id: dataPatient ? dataPatient._id : "",
        nametitle: dataPatient ? dataPatient.nametitle : "",
        name: dataPatient ? dataPatient.name : "",
        lastName: dataPatient ? dataPatient.lastName : "",
        age: dataPatient ? dataPatient.age : "",
        phoneNumber: dataPatient ? dataPatient.phoneNumber : "",
        emergencyContact: dataPatient ? dataPatient.emergencyContact : "",
        citizenid: dataPatient ? dataPatient.citizenid : "",
        race: dataPatient ? dataPatient.race : "",
        nationality: dataPatient ? dataPatient.nationality : "",
        address: dataPatient ? dataPatient.address : "",
        allergicMedicine: dataPatient ? dataPatient.allergicMedicine : "",
        symptoms: dataPatient ? dataPatient.symptoms : "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPatient]);

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
        <DialogTitle>เพิ่มผู้ป่วยเข้ารับการรักษา</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <form id="patient-form" onSubmit={formik.handleSubmit}>
            <Grid container>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label" sx={{ marginBottom: "8px" }}>
                  คำนำหน้า
                </InputLabel>
                <Select
                  labelId="prefix-label"
                  id="prefix"
                  value={formik.values.nametitle}
                  placeholder="เลือก"
                  disabled={view}
                  onChange={(e) =>
                    formik.setFieldValue("nametitle", e.target.value)
                  }
                  fullWidth
                  error={
                    formik.touched.nametitle && Boolean(formik.errors.nametitle)
                  }
                >
                  <MenuItem value="ด.ช">ด.ช</MenuItem>
                  <MenuItem value="ด.ญ">ด.ญ</MenuItem>
                  <MenuItem value="นาย">นาย</MenuItem>
                  <MenuItem value="นาง">นาง</MenuItem>
                  <MenuItem value="นางสาว">นางสาว</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">ชื่อ</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  name="name"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                />
              </Grid>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">นามสกุล</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="lastName"
                  name="lastName"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.lastName && Boolean(formik.errors.lastName)
                  }
                  helperText={formik.touched.lastName && formik.errors.lastName}
                />
              </Grid>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">อายุ</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="age"
                  name="age"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.age}
                  onChange={formik.handleChange}
                  error={formik.touched.age && Boolean(formik.errors.age)}
                  helperText={formik.touched.age && formik.errors.age}
                />
              </Grid>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">เบอร์โทร</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.phoneNumber &&
                    Boolean(formik.errors.phoneNumber)
                  }
                  helperText={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
                  }
                />
              </Grid>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">เบอร์โทรติดต่อฉุกเฉิน</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="emergencyContact"
                  name="emergencyContact"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.emergencyContact}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.emergencyContact &&
                    Boolean(formik.errors.emergencyContact)
                  }
                  helperText={
                    formik.touched.emergencyContact &&
                    formik.errors.emergencyContact
                  }
                />
              </Grid>
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">เลขบัตรประชาชน</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="citizenid"
                  name="citizenid"
                  label="เลขบัตรประชาชน"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.citizenid}
                  onChange={(e) => {
                    formik.handleChange(e);
                    setError(undefined);
                  }}
                  error={
                    (formik.touched.citizenid &&
                      Boolean(formik.errors.citizenid)) ||
                    error
                  }
                  helperText={
                    (formik.touched.citizenid && formik.errors.citizenid) ||
                    error
                  }
                />
              </Grid>{" "}
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">เชื้อชาติ</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="race"
                  name="race"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.race}
                  onChange={formik.handleChange}
                  error={formik.touched.race && Boolean(formik.errors.race)}
                  helperText={formik.touched.race && formik.errors.race}
                />
              </Grid>{" "}
              <Grid item xs={4} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">สัญชาติ</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="nationality"
                  name="nationality"
                  type="text"
                  fullWidth
                  variant="outlined"
                  disabled={view}
                  value={formik.values.nationality}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.nationality &&
                    Boolean(formik.errors.nationality)
                  }
                  helperText={
                    formik.touched.nationality && formik.errors.nationality
                  }
                />
              </Grid>
              <Grid item xs={6} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">ที่อยู่</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="address"
                  name="address"
                  type="text"
                  multiline
                  fullWidth
                  rows={4}
                  variant="outlined"
                  disabled={view}
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.address && Boolean(formik.errors.address)
                  }
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>{" "}
              <Grid item xs={6} sx={{ padding: "0px 10px" }}>
                <InputLabel id="prefix-label">ยาที่แพ้</InputLabel>
                <TextField
                  autoFocus
                  margin="dense"
                  id="allergicMedicine"
                  name="allergicMedicine"
                  type="text"
                  multiline
                  fullWidth
                  rows={4}
                  variant="outlined"
                  disabled={view}
                  value={formik.values.allergicMedicine}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.allergicMedicine &&
                    Boolean(formik.errors.allergicMedicine)
                  }
                  helperText={
                    formik.touched.allergicMedicine &&
                    formik.errors.allergicMedicine
                  }
                />
              </Grid>
            </Grid>
            <Grid item xs={6} sx={{ padding: "0px 10px" }}>
              <InputLabel id="prefix-label">อาการ</InputLabel>
              <TextField
                autoFocus
                margin="dense"
                id="symptoms"
                name="symptoms"
                type="text"
                multiline
                fullWidth
                rows={4}
                variant="outlined"
                disabled={view}
                value={formik.values.symptoms}
                onChange={formik.handleChange}
                error={
                  formik.touched.symptoms && Boolean(formik.errors.symptoms)
                }
                helperText={formik.touched.symptoms && formik.errors.symptoms}
              />
            </Grid>
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

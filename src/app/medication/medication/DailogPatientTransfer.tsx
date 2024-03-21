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
  patient?: any;
}

const postqueue = async (patient: any): Promise<any> => {
  console.log("values");

  try {
    const medical = await axiosInstance.patch(`medical/${patient._id}`, {
      status: "success",
    });

    return medical.data;
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

  const { mutate: medical } = useMutation<any, any, any>(
    (data: any) => postqueue(patient),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["medical"]);
        onClose();
      },
    }
  );

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
        <DialogTitle>รายละเอียดของการสั่งยา</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="address"
              name="address"
              type="text"
              multiline
              fullWidth
              rows={6}
              variant="outlined"
              disabled={true}
              value={patient.prescription}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button onClick={() => medical(patient)}>ยืนยัน</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogPatientTransfer;

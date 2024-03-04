import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface DialogPatientProps {
  open: boolean;
  onClose: () => void;
}

const DialogPatientTransfer: React.FC<DialogPatientProps> = ({
  open,
  onClose,
}) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const email = formJson.email;
    console.log(email);
    onClose();
  };

  return (
    <React.Fragment>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>เพิ่มผู้ป่วยเข้ารับการรักษา</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="symptoms"
            name="symptoms"
            label="คำนำหน้า"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="symptoms"
            name="symptoms"
            label="ชื่อ"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="treatment"
            name="treatment"
            label="นามสกุล"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="medicalHistory"
            name="medicalHistory"
            label="อายุ"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="address"
            name="address"
            label="ที่อยู่"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="phoneNumber"
            name="phoneNumber"
            label="เบอร์โทร"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="emergencyContact"
            name="emergencyContact"
            label="เบอร์โทรที่ติดต่อได้ฉุกเฉิน"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="emergencyContact"
            name="emergencyContact"
            label="อาการ"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="emergencyContact"
            name="emergencyContact"
            label="ยาที่แพ้"
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button type="submit" form="dialog-form">
            บันทึก
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default DialogPatientTransfer;

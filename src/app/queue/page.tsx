"use client";

import { useQuery } from "react-query";
import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"; // import Button
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DialogPatient from "./queue/DailogPatient";
import { axiosInstance } from "@/module/axios";

export default function Home() {
  const [open, setOpen] = useState(false);

  const [data, setData] = useState("");
  const [selectedQueue, setSelectedQueue] = useState<any>();
  const [isCallingQueue, setIsCallingQueue] = useState(0); // state สำหรับการเรียกคิว
  const [isDiagnosing, setIsDiagnosing] = useState(false); // state สำหรับการวินิจฉัยโรค
  const fetchDoctors = async () => {
    const response = await axiosInstance.get("doctor");
    return response.data;
  };
  const fetchQueue = async () => {
    if (data) {
      const response = await axiosInstance.get(`queue/find/${data}`);
      return response.data;
    }
  };
  const { data: doctors = [] } = useQuery("doctors", fetchDoctors);

  const {
    data: queue = [],
    isLoading,
    refetch,
  } = useQuery(
    ["queue", data], // queryKey
    fetchQueue // queryFn
  );

  const nextqueue = async (): Promise<any> => {
    if (!data) {
      alert("โปรดเลือกแพทย์");
      return;
    }
    setIsCallingQueue(0);
    setIsDiagnosing(false);
    setTimeout(() => {
      refetch();
    }, 500);
    try {
      const response = await axiosInstance.get(`queue/next/${data}`);
      setSelectedQueue(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };
  const nextgetqueue = async (id: string): Promise<any> => {
    try {
      const response = await axiosInstance.get(`queue/${id}`);

      setSelectedQueue(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const onClickDoctor = async (id: string) => {
    if (id) {
      await nextgetqueue(id);
      setData(id);
      setIsDiagnosing(false);
    }
    // setTimeout(() => {
    //   refetch();
    // }, 500);
  };

  const renderDialog = () => {
    return (
      <>
        {open && (
          <DialogPatient
            open={open}
            onClose={() => {
              setOpen(false);
              setIsDiagnosing(false);
              refetch;
            }}
            view={false}
            dataPatient={selectedQueue}
            onSave={() => setOpen(false)}
            dataDoctor={data}
          />
        )}
      </>
    );
  };

  const onClickCallQueue = () => {
    // โค้ดสำหรับเรียกคิว
    if (!data) {
      alert("โปรดเลือกแพทย์");
      return;
    }
    // เมื่อกดปุ่มเรียกคิวให้เปลี่ยนค่า isCallingQueue เป็น true
    setIsCallingQueue(isCallingQueue + 1);
  };

  const onClickDiagnose = () => {
    // โค้ดสำหรับวินิจฉัยโรค
    if (!data) {
      alert("โปรดเลือกแพทย์");
      return;
    }
    setOpen(true);
    setIsDiagnosing(true);
  };

  const columns: GridColDef[] = [
    {
      field: "no",
      headerName: "คิว ",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.queueNumber}</>;
      },
    },
    {
      field: "nametitle",
      headerName: "คำนำหน้า ",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.patient.nametitle}</>;
      },
    },
    {
      field: "name",
      headerName: "ชื่อ ",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.patient.name + " " + row.patient.lastName}</>;
      },
    },
    {
      field: "age",
      headerName: "อายุ",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.patient.age}</>;
      },
    },
    {
      field: "gender",
      headerName: "เพศ",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.patient.gender}</>;
      },
    },
    {
      field: "queuedAt",
      headerName: "วันที่สร้าง",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.queuedAt}</>;
      },
    },

    {
      field: "walking",
      headerName: "เคลื่อนย้าย",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.walking}</>;
      },
    },
    {
      field: "status",
      headerName: "status",
      width: 200,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.status}</>;
      },
    },
  ];

  return (
    <div>
      <Box>
        <InputLabel>เลือกแพทย์</InputLabel>
        <FormControl fullWidth>
          <Select
            id="doctor"
            name="doctor"
            placeholder="แพทย์"
            value={data || ""}
            onChange={(event) => {
              onClickDoctor(event.target.value);
            }}
            error={!data}
            fullWidth
          >
            <MenuItem value="" disabled>
              เลือกแพทย์
            </MenuItem>
            {doctors.map((doctor: any) => (
              <MenuItem key={doctor._id} value={doctor._id}>
                {doctor.name}
              </MenuItem>
            ))}
          </Select>
          {!data && <FormHelperText error>กรุณาเลือกแพทย์</FormHelperText>}
        </FormControl>

        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          bgcolor="#4CAF50" // Green background color
          p={2} // Padding
          borderRadius={4} // Rounded corners
          sx={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <Typography variant="h5">
            คิวที่:
            {selectedQueue?.queueNumber
              ? selectedQueue.queueNumber
              : "ไม่มีคิว"}
          </Typography>
          <Typography variant="h5">
            {selectedQueue?.patient?.gender} {selectedQueue?.patient?.name}{" "}
            {selectedQueue?.patient?.lastName}
          </Typography>
          <Typography variant="h5">
            เรียกครั้งที่:
            {isCallingQueue}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={onClickCallQueue}
          >
            เรียกคิว
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={onClickDiagnose}
            disabled={
              selectedQueue?.status === "finished" ||
              selectedQueue?.status === "isDiagnosing" ||
              !selectedQueue?.patient
                ? true
                : false
            } // กำหนด disabled ตามค่า isDiagnosing
          >
            วินิจฉัยโรค
          </Button>

          <Button variant="contained" color="primary" onClick={nextqueue}>
            คิวถัดไป
          </Button>
        </Box>

        <Box display="flex" justifyContent="center" mb={2}>
          <Typography variant="h5">ผู้ป่วยรอรับการรักษา</Typography>
        </Box>
        <Box>
          <DataGrid
            rows={queue || []}
            columns={columns}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            // pageSizeOptions={[10, 20, 50]}
            checkboxSelection={false}
            rowSelection
            onPaginationModelChange={(e) => console.log("Page", e)}
            disableColumnMenu
          />
        </Box>

        {renderDialog()}
      </Box>
    </div>
  );
}

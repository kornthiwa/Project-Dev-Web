"use client";

import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";
import { Box, Button, Chip, Grid, Typography } from "@mui/material"; // import Button
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdid, setOpenEdid] = useState(false);
  const [data, setData] = useState();

  const [openTransfer, setOpenTransfer] = useState(false);

  const {
    data: datatesxt,
    isLoading,
    isError,
    refetch,
  } = useQuery<any>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/patient");
      return response.data;
    },
  });

  const handleClickOpen = () => {
    setOpen(!open);
  };

  const onClickRowFunction = (data: any) => {
    console.log(data);
    setOpenTransfer(true);
    setData(data);
  };

  const handleMenuItemClick = (option: string, data: any) => {
    console.log("Option clicked:", option);
    setData(data);

    switch (option) {
      case "ดูข้อมูล":
        setOpenView(true);
        break;
      case "แก้ไขข้อมูล":
        setOpenEdid(true);
        break;
      default:
        // Handle default case
        break;
    }
  };

  const renderDialog = () => {
    return (
      <>
        {/* {open && (
          <DialogPatient
            open={open}
            onClose={() => {
              setOpen(false);
              refetch;
            }}
            view={false}
          />
        )}
        {openView && (
          <DialogPatient
            open={openView}
            onClose={() => {
              setOpenView(false);
              refetch;
            }}
            view={true}
            dataPatient={data}
          />
        )}
        {openEdid && (
          <DialogPatient
            open={openEdid}
            onClose={() => {
              setOpenEdid(false);
              refetch;
            }}
            view={false}
            eidit={true}
            dataPatient={data}
          />
        )}
        {openTransfer && (
          <DialogPatientTransfer
            open={openTransfer}
            onClose={() => {
              setOpenTransfer(false);
              refetch;
            }}
            patient={data}
          />
        )} */}
      </>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "no",
      headerName: "ลำดับ ",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.no}</>;
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
        return <>{row.nametitle}</>;
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
        return <>{row.name + " " + row.lname}</>;
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
        return <>{row.age}</>;
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
        return <>{row.gender}</>;
      },
    },
    {
      field: "citizenid",
      headerName: "เลขบัตรประชาชน",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.citizenid}</>;
      },
    },
    {
      field: "phoneNumber",
      headerName: "เบอร์โทร",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.phoneNumber}</>;
      },
    },
    {
      field: "emergencyContact",
      headerName: "เบอร์โทรฉุกเฉิน",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.emergencyContact}</>;
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
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          bgcolor="#4CAF50" // Green background color
          p={2} // Padding
          borderRadius={4} // Rounded corners
        >
          <Typography variant="h5">คิวที่: {"queueNumber"}</Typography>
          <Button variant="contained" color="primary">
            เรียกคิว
          </Button>
          <Button variant="contained" color="primary">
            คิวถัดไป
          </Button>
        </Box>
        <Box display="flex" justifyContent="center" mb={2}>
          <Typography variant="h5">ผู้ป่วยรอรับการรักษา</Typography>
        </Box>
        <Box>
          <DataGrid
            rows={(!isLoading && datatesxt) || []}
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

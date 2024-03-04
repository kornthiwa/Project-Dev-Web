"use client";

import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";
import { Box, Button, Chip, Typography } from "@mui/material"; // import Button
import DialogPatient from "./patient/DailogPatient";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import LongMenu from "./patient/MenuPatientTransfer";

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
        {open && (
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
      </>
    );
  };

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "ลำดับ ",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row._id}</>;
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
        return <>{row.name + row.lname}</>;
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
    {
      field: "",
      headerName: "",
      width: 100,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <Button onClick={() => onClickRowFunction(row)}>ส่งตัว</Button>;
      },
    },
    {
      field: "menu",
      headerName: "",
      width: 10,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return (
          <LongMenu
            items={["ดูข้อมูล", "แก้ไขข้อมูล"]}
            onClickItem={(option: string) => handleMenuItemClick(option, row)}
          />
        );
      },
    },
  ];

  return (
    <div>
      <Box>
        <Button variant="outlined" onClick={handleClickOpen}>
          เพิ่มผู้ป่วยเข้ารับการรักษา
        </Button>
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
        {renderDialog()}
      </Box>
    </div>
  );
}

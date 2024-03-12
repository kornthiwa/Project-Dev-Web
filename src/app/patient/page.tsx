"use client";

import { useQuery } from "react-query";
import { useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Grid,
  TextField,
  Typography,
} from "@mui/material"; // import Button
import DialogPatient from "./patient/DailogPatient";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import LongMenu from "./patient/MenuPatientTransfer";
import DialogPatientTransfer from "./patient/DailogPatientTransfer";
import { axiosInstance } from "@/module/axios";
import axios from "axios";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdid, setOpenEdid] = useState(false);
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState("");

  const [openTransfer, setOpenTransfer] = useState(false);

  const { data: dataAPISearch } = useQuery<any>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await axiosInstance.get(`patient`);
      return response.data;
    },
  });

  const {
    data: dataAPI,
    isLoading,
    isError,
    refetch,
  } = useQuery<any>({
    queryKey: ["patients", filteredData],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `patient/search?name=${filteredData}`
      );
      return response.data;
    },
  });
  const handlePatientSelect = (event: any, value: any) => {
    if (value) {
      console.log("Selected patient:", value);
      setFilteredData(value.name);
      refetch(); // ต้องเพิ่มวงเล็บนี้
    }
  };

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
        {openTransfer && (
          <DialogPatientTransfer
            open={openTransfer}
            onClose={() => {
              setOpenTransfer(false);
              refetch;
            }}
            patient={data}
          />
        )}
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
        <Grid
          container
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button variant="contained" onClick={handleClickOpen}>
            เพิ่มผู้ป่วยเข้ารับการรักษา
          </Button>
          <Autocomplete
            disablePortal
            options={!isLoading && dataAPISearch ? dataAPISearch : []}
            getOptionLabel={(option) => `${option.name} ${option.lname}`}
            renderInput={(params) => (
              <TextField {...params} label="ค้นหาผู้ป่วย" />
            )}
            style={{ width: 300, marginBottom: "1rem" }}
            onChange={handlePatientSelect}
            onInputChange={(event, newInputValue, reason) => {
              if (reason === "reset") {
                console.log(newInputValue);

                return;
              } else {
                setFilteredData("");
              }
            }}
          />
        </Grid>

        <DataGrid
          rows={(!isLoading && dataAPI) || []}
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

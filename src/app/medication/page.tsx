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
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { axiosInstance } from "@/module/axios";
import axios from "axios";
import LongMenu from "../patient/patient/MenuPatientTransfer";
import DialogPatientTransfer from "./medication/DailogPatientTransfer";

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

  const [selected, setSelected] = useState<any>(null);

  const {
    data: dataAPI,
    isLoading,
    isError,
    refetch,
  } = useQuery<any>({
    queryKey: ["medical"],
    queryFn: async () => {
      const response = await axiosInstance.get(`medical`);
      const data = response.data.reverse();
      return data;
    },
  });
  const { data: dataSearch } = useQuery<any>({
    queryKey: ["patient"],
    queryFn: async () => {
      const response = await axiosInstance.get(`patient`);
      return response.data;
    },
  });

  const onClickRowFunction = (data: any) => {
    console.log(data);
    setOpen(true);
    setData(data);
  };

  const renderDialog = () => {
    return (
      <>
        {open && (
          <DialogPatientTransfer
            open={open}
            patient={data}
            onClose={() => {
              setOpen(false);
              refetch;
            }}
          />
        )}
      </>
    );
  };

  const columns: GridColDef[] = [
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
      field: "citizenid",
      headerName: "เลขบัตรประชาชน",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.patient.citizenid}</>;
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
        return <>{row.patient.phoneNumber}</>;
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
        return <>{row.patient.emergencyContact}</>;
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

        switch (row.status) {
          case "success":
            return <Chip label={"จ่ายยาแล้ว"} color="success" />;

          case "successful":
            return <Chip label={"รอจ่ายยา"} color="warning" />;
          default:
            return <Chip label={row.status} color="warning" />;
        }
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
        return (
          <Button
            disabled={row.status !== "successful"}
            onClick={() => onClickRowFunction(row)}
            variant="contained"
          >
            จ่ายยา
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <Box>
        <Autocomplete
          options={(!isLoading && dataSearch) || []}
          // getOptionLabel={(option) => option.name} // ระบุฟิลด์ที่ใช้เป็น label ใน Autocomplete
          getOptionLabel={(option) => `${option.name} ${option.lastName}`}
          value={selected}
          onChange={(event, newValue) => {
            setSelected(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="ค้นหาผู้ป่วย" />
          )}
        />
        <DataGrid
          sx={{ marginTop: "18px" }}
          rows={
            (dataAPI && selected
              ? dataAPI.filter((row: any) => row.patient.name === selected.name)
              : dataAPI) || [] // กลับด้านข้อมูลก่อนที่จะนำมาใช้
          }
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

"use client";
import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { axiosInstance } from "@/module/axios";
import { useQuery } from "react-query";
import { Autocomplete, TextField } from "@mui/material";

const Patient: React.FC = () => {
  const [selected, setSelected] = useState<any>(null);

  const {
    data: dataAPI,
    isLoading,
    isError,
    refetch,
  } = useQuery<any>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await axiosInstance.get(`patient/search?name=`);
      return response.data;
    },
  });
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
    <>
      <Autocomplete
        options={(!isLoading && dataAPI) || []}
        getOptionLabel={(option) => option.name} // ระบุฟิลด์ที่ใช้เป็น label ใน Autocomplete
        value={selected}
        onChange={(event, newValue) => {
          setSelected(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="ค้นหาผู้ป่วย" />}
      />
      <DataGrid
        sx={{ marginTop: "18px" }}
        rows={
          (dataAPI && selected
            ? dataAPI.filter((row: any) => row.name === selected.name)
            : dataAPI) || []
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
    </>
  );
};

export default Patient;

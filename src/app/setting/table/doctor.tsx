"use client";
import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { axiosInstance } from "@/module/axios";
import { useQuery } from "react-query";
import { Autocomplete, TextField } from "@mui/material";

const Doctor: React.FC = () => {
  const [selected, setSelected] = useState<any>(null);

  const {
    data: dataAPI,
    isLoading,
    isError,
    refetch,
  } = useQuery<any>({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await axiosInstance.get(`doctor`);
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
      field: "department",
      headerName: "แผนก",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.department}</>;
      },
    },
    {
      field: "email",
      headerName: "เมล์",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.email}</>;
      },
    },
    {
      field: "position",
      headerName: "ตำแหน่ง",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.position}</>;
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
  ];
  return (
    <div>
      <Autocomplete
        options={(!isLoading && dataAPI) || []}
        getOptionLabel={(option) => option.name} // ระบุฟิลด์ที่ใช้เป็น label ใน Autocomplete
        value={selected}
        onChange={(event, newValue) => {
          setSelected(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="ค้นหาหมอ" />}
      />
      <DataGrid
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
    </div>
  );
};

export default Doctor;

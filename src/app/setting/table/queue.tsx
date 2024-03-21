"use client";
import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { axiosInstance } from "@/module/axios";
import { useQuery } from "react-query";
import { Autocomplete, Chip, TextField } from "@mui/material";

const Queue: React.FC = () => {
  const [selected, setSelected] = useState<any>(null);

  const {
    data: dataAPI,
    isLoading,
    isError,
    refetch,
  } = useQuery<any>({
    queryKey: ["queue"],
    queryFn: async () => {
      const response = await axiosInstance.get(`queue`);
      return response.data;
    },
  });
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
        return <>{row.patient?.nametitle}</>;
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
        return <>{row.patient?.name + " " + row.patient?.lastName}</>;
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
        return <>{row.patient?.age}</>;
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
        return <>{row.patient?.gender}</>;
      },
    },
    {
      field: "doctor",
      headerName: "หมอ",
      width: 100,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.doctor?.name}</>;
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
        switch (row.walking) {
          case "walking":
            return <Chip color="success" size="small" label={"เดิน"} />;
          case "lyingDown":
            return <Chip color="success" size="small" label={"เปลนอน"} />;
          case "wheelchair":
            return <Chip color="success" size="small" label={"รถเข็น"} />;
          default:
            return <Chip label={row.walking} color="warning" />;
        }
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
          case "finished":
            return <Chip label={"เรียกคิวแล้ว"} color="info" />;

          case "queue":
            return <Chip label={"รอเรียกคิว"} color="warning" />;
            break;
          default:
            return <Chip label={"รอเรียกคิว"} color="warning" />;
        }
      },
    },
  ];
  return (
    <>
      <Autocomplete
        options={(!isLoading && dataAPI) || []}
        getOptionLabel={(option) => option.patient.name} // ระบุฟิลด์ที่ใช้เป็น label ใน Autocomplete
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
            ? dataAPI.filter(
                (row: any) => row.patient.name === selected.patient.name
              )
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

export default Queue;

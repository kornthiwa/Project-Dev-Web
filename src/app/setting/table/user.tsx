"use client";
import React, { useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { axiosInstance } from "@/module/axios";
import { useQuery } from "react-query";
import { Autocomplete, Button, Chip, Grid, TextField } from "@mui/material";
import DialogAddUser from "./DialogAddUser";

const User: React.FC = () => {
  const [selected, setSelected] = useState<any>(null);
  const [openTransfer, setOpenTransfer] = useState(false);

  const {
    data: dataAPI,
    isLoading,
    isError,
    refetch,
  } = useQuery<any>({
    queryKey: ["login"],
    queryFn: async () => {
      const response = await axiosInstance.get(`login`);
      return response.data;
    },
  });
  const renderDialog = () => {
    return (
      <>
        {openTransfer && (
          <DialogAddUser
            open={openTransfer}
            onClose={() => {
              setOpenTransfer(false);
              refetch;
            }}
          />
        )}
      </>
    );
  };
  const columns: GridColDef[] = [
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
      field: "role",
      headerName: "Role ",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return (
          <>
            <Chip label={row.role} color="info" />
          </>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "สร้างเมื่อ ",
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      align: "left",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        const formattedDate = new Date(row.createdAt).toLocaleDateString(
          "th-TH",
          { weekday: "long", year: "numeric", month: "long", day: "numeric" }
        );
        return <>{formattedDate}</>;
      },
    },
  ];
  return (
    <>
      <Grid container direction="row">
        <Autocomplete
          options={(!isLoading && dataAPI) || []}
          getOptionLabel={(option) => option.name} // ระบุฟิลด์ที่ใช้เป็น label ใน Autocomplete
          value={selected}
          fullWidth
          onChange={(event, newValue) => {
            setSelected(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="ค้นหาผู้ป่วย" />
          )}
        />
        <Button
          variant="outlined"
          sx={{ marginTop: "18px" }}
          onClick={() => {
            setOpenTransfer(true);
          }}
        >
          เพิ่มข้อมูลผู้ใช้
        </Button>
      </Grid>
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
      {renderDialog()}
    </>
  );
};

export default User;

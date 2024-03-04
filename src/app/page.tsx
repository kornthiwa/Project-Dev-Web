"use client";

import { Button, Card, Chip, Typography, styled } from "@mui/material";
import axios from "axios";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "react-query";

export default function Home() {
  const {
    data: datatesxt,
    isLoading,
    isError,
  } = useQuery<any>({
    queryKey: ["todos"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:8080/patient");
      return response.data;
    },
  });

  const onClickRowFunction = (data: any) => {
    console.log(data);
  };

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Active",
      width: 100,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return <>{row.name}</>;
      },
    },
    {
      field: "name",
      headerName: "Active",
      width: 100,
      disableColumnMenu: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params: any) => {
        const { row } = params;
        return (
          <>
            <Button onClick={() => onClickRowFunction(row)}>กดxddsaf</Button>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Card sx={{ minHeight: 100, overflow: "hidden" }}>
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
      </Card>
    </div>
  );
}

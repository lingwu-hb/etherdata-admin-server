// @flow
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useRouter } from "next/dist/client/router";
import { Button } from "@mui/material";
import { PaginatedStorageUsers } from "../../internal/services/dbServices/storage-management-system-plugin";
import { Configurations } from "../../internal/const/configurations";
import { DefaultStorageUser } from "../../internal/const/defaultValues";
import qs from "query-string";

type Props = {
  storageUser: PaginatedStorageUsers;
  handlePageChange(number: number): Promise<void>;
  currentPage: number;
};

/**
 * Show user
 * @param {PaginatedStorageUsers} storageUser data to be shown
 * @param {function} handlePageChange Go to next page
 * @param {number}currentPage Current page number
 * @constructor
 */
export function UserTable({
  storageUser,
  handlePageChange,
  currentPage,
}: Props) {
  const { totalUsers, users } = storageUser;
  const router = useRouter();

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 3 },
    { field: "user_name", headerName: "User Name", flex: 3 },
    { field: "coinbase", headerName: "Coinbase", flex: 5 },
    {
      field: "detail",
      headerName: "Detail",
      flex: 2,
      renderCell: (params) => {
        const user = users.find((u) => u.user_id === params.value);
        return (
          <Button
            onClick={async () => {
              if (params.value === DefaultStorageUser.id) {
                const query = qs.stringify({ name: user?.user_name });
                await router.push(`/user/${params.value}?${query}`);
              } else {
                const query = qs.stringify({
                  name: user?.user_name,
                  coinbase: user?.coinbase,
                });
                await router.push(`/user/${params.value}?${query}`);
              }
            }}
          >
            Details
          </Button>
        );
      },
    },
  ];

  const rows = users.map((u, index) => {
    return {
      id: index,
      detail: u.user_id,
      user_name: u.user_name,
      coinbase: u.coinbase,
    };
  });

  return (
    <DataGrid
      columns={columns}
      rows={rows}
      autoHeight
      disableSelectionOnClick
      paginationMode={"server"}
      page={currentPage}
      rowCount={totalUsers}
      pageSize={Configurations.numberPerPage}
      onPageChange={async (page) => {
        await handlePageChange(page);
      }}
    />
  );
}

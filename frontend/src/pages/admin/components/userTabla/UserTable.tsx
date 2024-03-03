import { useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, userObject,DeleteUser } from "../../../../redux/slices/userSlice";
import { RootState } from "../../../../redux/store/store";
import { Button } from "@mui/material";
import { AppDispatch } from "../../../../redux/store/store";
import { useNavigate } from "react-router-dom";
import "./userTable.scss";
function UserTable() {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const rows: userObject[] = useSelector(
    (state: RootState) => state.users.users
  );

  const handleDeleteClick = (id: string) => {
    dispatch(DeleteUser({id:id}))

  };

  const handleDetailClick = (id: string) => {
    navigate(`/adminUserDetail/${id}`)
  };

  const columns: GridColDef[] = [
    { field: "_id", headerName: "ID", width: 240 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    { field: "username", headerName: "Username", width: 130 },
    {
      field: "isPublic",
      headerName: "Account",
      width: 130,
      renderCell: (params) => (
        <span>{params.value ? "Public" : "Private"}</span>
      ),
    },
    {
      field: "detail",
      headerName: "Detail",
      width: 130,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => handleDetailClick(params.id as string)}
        >
          Detail
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 130,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          onClick={() => handleDeleteClick(params.id as string)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <section id="userTable">
      <div className="container">
        <div className="head">
          <p className="users">Users</p>
        </div>
        <div className="table">
          <div style={{ maxWidth: "100%", margin: "0 auto" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={100}
              disableSelectionOnClick
              getRowId={(row) => row._id}
              autoHeight
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default UserTable;

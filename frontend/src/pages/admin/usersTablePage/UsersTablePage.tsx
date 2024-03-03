import AdminNavbar from "../adminNavbar/AdminNavbar"
import SideBar from "../components/sideBar/SideBar"
import UserTable from "../components/userTabla/UserTable"


function UsersTablePage() {
  return (
    <div>
        <SideBar/>
        <AdminNavbar/>
        <UserTable/>
    </div>
  )
}

export default UsersTablePage
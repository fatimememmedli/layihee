import AdminNavbar from "../adminNavbar/AdminNavbar";
import SideBar from "../components/sideBar/SideBar";
import UserTable from "../components/userTabla/UserTable";
import Dashboard from "../dashboard/Dashboard";

function AdminHome() {
  const admin = localStorage.getItem("isAdmin")
  console.log(admin)
  return (
    <section id="AdminHome">
      {admin=="true" ? <>
      <SideBar/>
      <AdminNavbar />
      <Dashboard />
      <UserTable/>
      </> : null }
      
    </section>
  );
}

export default AdminHome;

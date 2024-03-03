import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../redux/store/store";
import { useNavigate } from "react-router-dom";
import { ChangeAdminNavbarState } from "../../../../redux/slices/adminSlice";
import "./sideBar.scss";
import "animate.css";
function SideBar() {
  const navbarState = useSelector((state: RootState) => state.admin.navbar);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  return (
    <section
      className={
        navbarState
          ? "SideBarAdmin displayBlock animate__animated animate__slideInLeft"
          : "SideBarAdmin animate__animated animate__slideInRight"
      }
    >
      <div
        onClick={() => {
          dispatch(ChangeAdminNavbarState(false));
        }}
        className="head"
      >
        <p className="text">Dash UI</p>
        <FontAwesomeIcon icon={faXmark} />
      </div>
      <div className="sections">
        <div onClick={()=> navigate("/admin")} className="section">
          <FontAwesomeIcon icon={faHouse} />
          <p className="dashboard">Dashboard</p>
        </div>
        <div onClick={()=> navigate("/adminUsers")} className="section">
          <FontAwesomeIcon icon={faUsers} />
          <p className="dashboard">Users</p>
        </div>
        <div onClick={()=> navigate("/createUser")} className="section">
          <FontAwesomeIcon icon={faUserPlus} />
          <p className="dashboard">Add User</p>
        </div>
        <div onClick={()=> {
          localStorage.removeItem("id")
          localStorage.removeItem("isAdmin")
          navigate("/login")
        }} className="section">
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <p className="dashboard">Log Out</p>
        </div>
      </div>
    </section>
  );
}

export default SideBar;

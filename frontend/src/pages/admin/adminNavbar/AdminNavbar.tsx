import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../redux/store/store";
import { ChangeAdminNavbarState } from "../../../redux/slices/adminSlice";
import { useNavigate } from "react-router-dom";
import "./adminNavbar.scss";
function AdminNavbar() {
  const id: string | null = JSON.parse(localStorage.getItem("id"));
  const navigate = useNavigate();
  const navbarState = useSelector((state: RootState) => state.admin.navbar);
  const users = useSelector((state: RootState) => state.users.users);
  const adminUser = users.find((Elem) => Elem._id == id);
  console.log(adminUser);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  return (
    <section id="adminNavbar">
      <div className="container">
        <div className="left">
          <FontAwesomeIcon
            onClick={() => {
              if (navbarState) {
                dispatch(ChangeAdminNavbarState(false));
                console.log(navbarState);
              } else {
                dispatch(ChangeAdminNavbarState(true));
                console.log(navbarState);
              }
            }}
            icon={faBars}
          />
          <div onClick={() => navigate("/admin")} className="image">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo.png"
              alt=""
            />
          </div>
        </div>
        <div className="right">
          <div className="profile">
            <img src={adminUser?.profileImage} alt="" />
          </div>
          <p className="username">{adminUser?.username}</p>
        </div>
      </div>
    </section>
  );
}

export default AdminNavbar;

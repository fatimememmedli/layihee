import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { faImages } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, userObject } from "./../../../redux/slices/userSlice"
import { RootState } from "../../../redux/store/store";
import { AppDispatch } from"../../../redux/store/store";
import { useEffect } from "react";
import "./dashboard.scss";
function Dashboard() {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const navigate  = useNavigate();
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const users: userObject[] = useSelector(
    (state: RootState) => state.users.users
  );
  const totalPostsCount = users.reduce((count, user) => count + user.posts.length, 0);
  const totalStoriesCount = users.reduce((count, user) => count + user.stories.length, 0);
  return (
    <section id="dashboard">
      <div className="container">
        <div className="head">
          <p className="head">Dashboard</p>
          <button onClick={()=> navigate("/createUser")} className="createUser">Create New User</button>
        </div>
        <div className="boxes">
          <div onClick={()=> navigate("/adminUsers")} className="box">
            <div className="box-head">
              <p className="users">Users</p>
              <div className="icon">
                <FontAwesomeIcon icon={faUsers} />
              </div>
            </div>
            <div className="count">{users.length}</div>
          </div>
          <div className="box">
            <div className="box-head">
              <p className="users">Posts</p>
              <div className="icon">
                <FontAwesomeIcon icon={faImages} />
              </div>
            </div>
            <div className="count">{totalPostsCount}</div>
          </div>
          <div className="box">
            <div className="box-head">
              <p className="users">Stories</p>
              <div className="icon">
                <FontAwesomeIcon icon={faCamera} />
              </div>
            </div>
            <div className="count">{totalStoriesCount}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;

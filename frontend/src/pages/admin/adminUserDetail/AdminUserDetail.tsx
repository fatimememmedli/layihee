import AdminNavbar from "../adminNavbar/AdminNavbar";
import SideBar from "../components/sideBar/SideBar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "../../../components/postCard/PostCard";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import {
  getAllUsers,
  userObject,
  sendNotification,
  UnReport,
  Report,
} from "./../../../redux/slices/userSlice";
import { RootState } from "../../../redux/store/store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { AppDispatch } from "../../../redux/store/store";
import TextField from "@mui/material/TextField";
import "./adminUserDetail.scss";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
function AdminUserDetail() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [notifValue, setNotifValue] = useState("");
  const [report, setReport] = useState(false);
  const { id } = useParams();
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (report) {
      dispatch(getAllUsers());
    }
  }, [dispatch]);
  const users: userObject[] = useSelector(
    (state: RootState) => state.users.users
  );
  const user = users.find((element) => element._id == id);
  console.log(user);
  return (
    <>
      <SideBar />
      <AdminNavbar />
      <div className="adminUserDetail">
        <div className="container">
          <div className="card">
            <div className="card-head">
              <div className="image">
                <img src={user?.profileImage} alt="" />
              </div>
              <div className="info">
                <p className="username">{user?.username}</p>
                <p className="firstLast">
                  {user?.firstName} {user?.lastName}
                </p>
                <div className="follower-following">
                  <p className="follower">{user?.follower.length} follower</p>
                  <p className="following">
                    {user?.following.length} following
                  </p>
                </div>
              </div>
            </div>
            <div className="bio">{user?.bio}</div>
            <div className="button">
              <button onClick={handleOpen}>Send Notification</button>
              <button
                onClick={() => {
                  if (user?.report) {
                    dispatch(UnReport({ id: id }));
                    setReport(true)

                  } else {
                    dispatch(Report({ id: id }));
                    setReport(true)
                  }
                }}
                className={user?.report ? "unreport" : "report"}
              >
                <FontAwesomeIcon icon={faCircleExclamation} />
              </button>
            </div>
          </div>
          <div className="posts">
            <div className="posts">
              {user?.posts.length == 0 ? (
                <div className="no-posts">
                  <FontAwesomeIcon icon={faImage} />
                  <p className="noPosts">No posts yet</p>
                </div>
              ) : (
                user?.posts &&
                user?.posts
                  ?.slice()
                  .reverse()
                  .map((post) => {
                    return (
                      <PostCard key={uuidv4()} post={post} id={user?._id} />
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <div className="modal">
            <p className="head">Send Notification</p>
            <div className="input-btn">
              <TextField
                id="outlined-basic"
                label="notification"
                variant="outlined"
                value={notifValue}
                onChange={(e) => {
                  setNotifValue(e.target.value);
                }}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  dispatch(sendNotification({ id: id, msg: notifValue }));
                  setNotifValue("");
                }}
              >
                Send
              </Button>
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default AdminUserDetail;

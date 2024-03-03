import Navbar from "../../components/navbar/Navbar";
import NavbarLeft from "../../components/navbarLeft/NavbarLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import PostCard from "../../components/postCard/PostCard";
import { AppDispatch } from "../../redux/store/store";
import Box from "@mui/material/Box";
import { Swiper, SwiperSlide } from "swiper/react";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import Modal from "@mui/material/Modal";
import {
  getAllUsers,
  userObject,
  getLoginUser,
} from "../../redux/slices/userSlice";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./myprofile.scss";
import { useNavigate } from "react-router-dom";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
function MyProfile() {
  const id: string = JSON.parse(localStorage.getItem("id") ?? "null") as string;
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();
  const users: userObject[] = useSelector(
    (state: RootState) => state.users.users
  );
  const loginUser: userObject = users.find((elem) => elem._id == id)!;

  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getLoginUser(id));
  }, [dispatch]);
  console.log("myprofile", loginUser);
  return (
    <>
      <Navbar />
      <NavbarLeft />
      <section id="MyProfile">
        <div className="profile">
          <div className="head-image">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/group/group-cover-4.jpg"
              alt=""
            />
          </div>
          <div className="info-profile">
            <div className="left">
              <div
                onClick={handleOpen}
                className={
                  loginUser?.stories?.length > 0
                    ? "image border-story"
                    : "image"
                }
              >
                <img src={loginUser?.profileImage} alt="" />
              </div>
              <div className="name-followers-bio">
                <p className="username">@{loginUser?.username}</p>
                <p className="name">
                  {loginUser?.firstName} {loginUser?.lastName}
                </p>
                <div className="follower-following">
                  <p
                    onClick={() => navigate(`/followers/${loginUser._id}`)}
                    className="followers text"
                  >
                    {loginUser?.follower?.length} <span>followers</span>
                  </p>
                  <p
                    onClick={() => navigate(`/following/${loginUser._id}`)}
                    className="following text"
                  >
                    {loginUser?.following?.length} <span>following</span>
                  </p>
                </div>
                <div className="bio">
                  <p>{loginUser?.bio}</p>
                </div>
              </div>
            </div>
            <div className="right">
              <div
                onClick={() => {
                  navigate("/editProfile");
                }}
                className="button"
              >
                <FontAwesomeIcon icon={faPen} />
                <span>Edit</span>
              </div>
            </div>
          </div>
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="MyProfile-modal"
        >
          <Box sx={style}>
            <Swiper
              navigation={true}
              slidesPerView={1}
              spaceBetween={0}
              pagination
              modules={[Pagination, Navigation]}
              className="mySwiper"
            >
              <div className="story-modal-content">
                <div className="stories">
                  {loginUser?.stories?.map((story, index) => (
                    <SwiperSlide key={index}>
                      <div className="storyImage">
                        <img src={story?.imgSRC} alt="" />
                        <div className="profile-username">
                          <div className="profileImage">
                            <img src={loginUser?.profileImage} alt="" />
                          </div>
                          <p className="username">{loginUser?.username}</p>
                        </div>
                        {story?.title ? (
                          <div className="description">
                            <p>{story?.title}</p>
                          </div>
                        ) : null}
                      </div>
                    </SwiperSlide>
                  ))}
                </div>
              </div>
            </Swiper>
            <button className="close" onClick={handleClose}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </Box>
        </Modal>
        {loginUser?.posts?.length === 0 ? (
          <div className="posts">
            <div className="no-posts">
              <FontAwesomeIcon icon={faImage} />
              <p className="noPosts">No posts yet</p>
            </div>
          </div>
        ) : (
          <div className="posts">
            {loginUser?.posts
              ?.slice()
              .reverse()
              .map((post) => {
                return (
                  <PostCard key={uuidv4()} post={post} id={loginUser?._id} />
                );
              })}
          </div>
        )}
      </section>
    </>
  );
}

export default MyProfile;

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { memo } from "react";
import { AppDispatch } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import {
  navbarLeftChange,
  addPost,
  ReadRequest,
  deleteLikeNotification,
  getLoginUser,
  addStory,
  Read,
  deleteRequest,
  ConfirmRequest,
} from "../../redux/slices/userSlice";
import { getAllUsers, userObject } from "../../redux/slices/userSlice";
import { RootState } from "../../redux/store/store";
import Box from "@mui/material/Box";
import axios from "axios";
import Modal from "@mui/material/Modal";
import { useEffect, useRef } from "react";
import { ChangeEvent } from "react";
import "./navbar.scss";
import "animate.css";
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
const Navbar = memo(() => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const inputRef = useRef<HTMLInputElement | null>(null)!;
  const users = useSelector((state: RootState) => state.users.users);
  const [profile, setProfile] = useState<boolean>(false);
  const [post, setPost] = useState<boolean>(false);
  const [dispatchAction, setDispatchAction] = useState<boolean>(false);
  const navigate = useNavigate();
  const [create, setCreate] = useState(false);
  const [notif, setNotif] = useState(false);
  const [imageChange, setImageChange] = useState<File | undefined>(undefined);
  const [imageLink, setİmageLink] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const [search, setSearch] = useState<string>("");
  const [searchArray, setSearchArray] = useState<userObject[]>([]);

  const state: boolean = useSelector(
    (state: RootState) => state.users.navbarLeft
  );
  const idlogin: string = JSON.parse(
    localStorage.getItem("id") ?? "null"
  ) as string;
  const loginUser: userObject = useSelector(
    (state: RootState) => state.users.login
  );
  useEffect(() => {
    const cleanedSearch = search.trim();

    const filteredUsers = users?.filter((user) => {
      const { username, firstName, lastName } = user;
      return (
        username.toLowerCase().includes(cleanedSearch.toLowerCase()) ||
        firstName.toLowerCase().includes(cleanedSearch.toLowerCase()) ||
        lastName.toLowerCase().includes(cleanedSearch.toLowerCase())
      );
    });
    setSearchArray(filteredUsers);
  }, [search, users]);
  useEffect(() => {
    console.log(loginUser);
    dispatch(getLoginUser(idlogin));

    if (dispatchAction) {
      dispatch(getAllUsers());
    }
  }, [dispatchAction,dispatch]);
  console.log(users);
  if (imageChange) {
    axios
      .post(
        "http://localhost:7070/photos",
        { file: imageChange },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        setİmageLink(res.data);
        console.log(imageLink);
      });
  }

  console.log("navbar", loginUser);

  const unreadRequestsCount =
    loginUser?.requests?.filter((request) => !request.wasRead).length || 0;
  const unreadNotificationsCount =
    loginUser?.notifications?.filter((notification) => !notification.wasRead)
      .length || 0;
  const handleImageClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      console.log("selected", selectedFile);
      setImageChange(selectedFile);
      console.log("imageChange", imageChange);
    }
  };
  return (
    <nav>
      <div className="container">
        <div className="logo-bars">
          <div
            onClick={() => {
              if (state) {
                dispatch(navbarLeftChange(false));
                setDispatchAction(true);
              } else {
                dispatch(navbarLeftChange(true));
                setDispatchAction(true);
              }
            }}
            className="bars"
          >
            <FontAwesomeIcon icon={faBars} />
          </div>
          <div
            onClick={() => {
              navigate("/");
            }}
            className="logo"
          >
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo.png"
              alt=""
            />
          </div>
          <div
            onClick={() => {
              navigate("/");
            }}
            className="logoResponsive"
          >
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo-mobile.png"
              alt=""
            />
          </div>
        </div>

        <div className="search-input">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder="Search Friends"
            type="text"
          />
          {search ? (
            <div className="searchResults animate__animated animate__fadeIn animate__faster">
              {searchArray.map((searchResult: userObject) => {
                return (
                  <div
                    key={uuidv4()}
                    onClick={() => {
                      if (searchResult._id == loginUser?._id) {
                        navigate(`/myProfile`);
                        setSearch("");
                      } else {
                        navigate(`/userProfile/${searchResult?._id}`);
                        setSearch("");
                      }
                    }}
                    className="search-result"
                  >
                    <div className="left-image">
                      <img src={searchResult.profileImage} alt="" />
                    </div>
                    <div className="right-username-firtLastname">
                      <p className="username">@{searchResult.username}</p>
                      <p className="firstLastName">
                        {searchResult.firstName} {searchResult.lastName}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>

        <div className="addPost-notification">
          <div
            onClick={() => {
              setCreate((state) => !state);
              setNotif(false);
              setProfile(false);
            }}
            className="addPost circle"
          >
            <FontAwesomeIcon icon={faPlus} />
            <div
              className={
                create
                  ? "create-box display-block animate__animated animate__fadeIn animate__faster"
                  : "create-box"
              }
            >
              <div className="head">
                <p className="head-text">Create</p>
              </div>

              <div className="sections">
                <div
                  onClick={() => {
                    handleOpen();
                    setPost(false);
                  }}
                  className="section story"
                >
                  <FontAwesomeIcon icon={faBookOpen} />
                  <p className="text">Story</p>
                </div>
                <div
                  onClick={() => {
                    handleOpen();
                    setPost(true);
                  }}
                  className="section post"
                >
                  <FontAwesomeIcon icon={faCamera} />
                  <p className="text">Post</p>
                </div>
              </div>
            </div>
          </div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="child-modal-title"
            aria-describedby="child-modal-description"
          >
            <Box sx={{ ...style, width: 200 }}>
              <div className="SharePost">
                <div onClick={handleImageClick} className="post">
                  {imageChange ? (
                    <img src={URL.createObjectURL(imageChange)} alt="" />
                  ) : (
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                  )}

                  <input
                    onChange={handleImageChange}
                    ref={inputRef}
                    type="file"
                  />
                </div>
                <div className="decription-input">
                  <label htmlFor="">What do you have in mind?</label>
                  <input
                    onChange={(e) => {
                      setDesc(e.target.value);
                    }}
                    placeholder="description"
                    type="text"
                  />
                </div>
                <div className="share-btn">
                  <button
                    onClick={() => {
                      if (post) {
                        dispatch(
                          addPost({
                            id: loginUser?._id,
                            img: imageLink,
                            title: desc,
                          })
                        );
                        setDispatchAction(true);
                      } else {
                        dispatch(
                          addStory({
                            id: loginUser?._id,
                            img: imageLink,
                            title: desc,
                          })
                        );
                        setDispatchAction(true);
                      }

                      handleClose();
                      navigate("/");
                      setImageChange(undefined);
                    }}
                  >
                    Create
                  </button>
                </div>
              </div>
            </Box>
          </Modal>
          <div
            onClick={() => {
              setNotif((state) => !state);
              setCreate(false);
              setProfile(false);
            }}
            className="notification circle"
          >
            <FontAwesomeIcon icon={faBell} />
            <div
              className={
                notif
                  ? "notificationBox displayBlock animate__animated animate__fadeIn animate__faster"
                  : "notificationBox"
              }
            >
              <div className="head">
                <p className="headText">Notifications</p>
              </div>
              <div className="notifications">
              {loginUser?.adminNotif
                  ?.slice()
                  .reverse()
                  .map((elem) => {
                    return (
                      <div key={uuidv4()} className="notifLike">
                        <div className="left-middle">
                          <div className="left">
                            <img
                              src="https://upload.wikimedia.org/wikipedia/commons/4/43/Minimalist_info_Icon.png"
                              alt=""
                            />
                          </div>
                          <div className="middle">
                            <span className="text">{elem}</span>
                          </div>
                        </div>
                        <div className="right"></div>
                      </div>
                    );
                  })}
                {loginUser?.requests
                  ?.slice()
                  .reverse()
                  .map((request) => {
                    const userFind = users.find(
                      (elem) => elem._id == request.id
                    );
                    return (
                      <div key={uuidv4()} className="notifRequest">
                        <div className="left-middle">
                          <div className="left">
                            <img src={userFind?.profileImage} alt="" />
                          </div>
                          <div className="middle">
                            <p className="usernameNotif ">
                              {userFind?.username}
                              <span className="text">
                                requested to follow you
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="right">
                          <button
                            onClick={() => {
                              dispatch(
                                ConfirmRequest({
                                  loginId: loginUser?._id,
                                  userId: request.id,
                                })
                              );
                              setDispatchAction(true);
                            }}
                            className="confirm"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => {
                              dispatch(
                                deleteRequest({
                                  loginId: loginUser?._id,
                                  requestId: request.id,
                                })
                              );
                              setDispatchAction(true);
                            }}
                            className="delete"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                          {!request.wasRead ? (
                            <button
                              onClick={() => {
                                dispatch(
                                  ReadRequest({
                                    id: request.id,
                                    loginId: loginUser?._id,
                                  })
                                );
                                setDispatchAction(true);
                              }}
                              className="read"
                            >
                              <FontAwesomeIcon icon={faCheck} />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                {loginUser?.notifications
                  ?.slice()
                  .reverse()
                  .map((elem) => {
                    if (
                      elem.type == "like" &&
                      elem.likeOrCommentId != loginUser._id
                    ) {
                      const findUser = users.find(
                        (element) => element._id == elem.likeOrCommentId
                      );
                      return (
                        <div key={uuidv4()} className="notifLike">
                          <div className="left-middle">
                            <div className="left">
                              <img src={findUser?.profileImage} alt="" />
                            </div>
                            <div className="middle">
                              <p className="usernameNotif ">
                                {findUser?.username}
                                <span className="text">liked your post</span>
                              </p>
                            </div>
                          </div>
                          <div className="right">
                            <button
                              onClick={() => {
                                dispatch(
                                  deleteLikeNotification({
                                    likeId: elem.likeOrCommentId,
                                    postId: elem.postId,
                                    loginId: loginUser._id,
                                    type: elem.type,
                                  })
                                );
                                setDispatchAction(true);
                              }}
                              className="delete"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            {!elem?.wasRead ? (
                              <button
                                onClick={() => {
                                  dispatch(
                                    Read({
                                      loginId: loginUser._id,
                                      type: elem.type,
                                      id: elem.id,
                                    })
                                  );
                                  setDispatchAction(true);
                                }}
                                className="read"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    } else if (
                      elem.type == "comment" &&
                      elem.likeOrCommentId != loginUser._id
                    ) {
                      const findUser = users.find(
                        (element) => element._id == elem.likeOrCommentId
                      );

                      return (
                        <div key={uuidv4()} className="notifComment">
                          <div className="left-middlee">
                            <div className="left">
                              <img src={findUser?.profileImage} alt="" />
                            </div>
                            <div className="middle">
                              <p className="usernameNotif ">
                                {findUser?.username}
                                <span className="text">
                                  commented: "{elem?.comment}"
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="right">
                            <button
                              onClick={() => {
                                dispatch(
                                  deleteLikeNotification({
                                    likeId: elem.likeOrCommentId,
                                    postId: elem.postId,
                                    loginId: loginUser._id,
                                    type: elem.type,
                                  })
                                );
                                setDispatchAction(true);
                              }}
                              className="delete"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            {!elem?.wasRead ? (
                              <button
                                onClick={() => {
                                  dispatch(
                                    Read({
                                      loginId: loginUser._id,
                                      type: elem.type,
                                      id: elem.id,
                                    })
                                  );
                                  setDispatchAction(true);
                                }}
                                className="read"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    } else if (elem.type == "follow") {
                      const findUser = users.find(
                        (element) => element._id == elem.likeOrCommentId
                      );
                      return (
                        <div key={uuidv4()} className="notifFOllow">
                          <div className="left-middlee">
                            <div className="left">
                              <img src={findUser?.profileImage} alt="" />
                            </div>
                            <div className="middle">
                              <p className="usernameNotif ">
                                {findUser?.username}
                                <span className="text">
                                  started following you.
                                </span>
                              </p>
                            </div>
                          </div>
                          <div className="right">
                            <button
                              onClick={() => {
                                dispatch(
                                  deleteLikeNotification({
                                    likeId: elem.likeOrCommentId,
                                    postId: elem.postId,
                                    loginId: loginUser._id,
                                    type: elem.type,
                                  })
                                );
                                setDispatchAction(true);
                              }}
                              className="delete"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                            {!elem?.wasRead ? (
                              <button
                                onClick={() => {
                                  dispatch(
                                    Read({
                                      loginId: loginUser._id,
                                      type: elem.type,
                                      id: elem.id,
                                    })
                                  );
                                  setDispatchAction(true);
                                }}
                                className="read"
                              >
                                <FontAwesomeIcon icon={faCheck} />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      );
                    }
                  })}

               
              </div>
            </div>
            {unreadRequestsCount + unreadNotificationsCount > 0 ? (
              <div className="count">
                <span>{unreadRequestsCount + unreadNotificationsCount}</span>
              </div>
            ) : null}
          </div>
          <div onClick={()=>{
            navigate("/chat")
          }} className="chat circle">
            <FontAwesomeIcon icon={faMessage} />
          </div>
          <div
            onClick={() => {
              setProfile((state) => !state);
              setCreate(false);
              setNotif(false);
            }}
            className="profile"
          >
            <img src={loginUser?.profileImage} alt="" />
            <div
              className={
                profile
                  ? "profileBox displayBlock animate__animated animate__fadeIn animate__faster "
                  : "profileBox"
              }
            >
              <div
                onClick={() => {
                  navigate("/myProfile");
                }}
                className="head"
              >
                <div className="left">
                  <div className="profilePhoto">
                    <img src={loginUser?.profileImage} alt="" />
                  </div>
                </div>
                <div className="right">
                  <p className="name">
                    {loginUser?.firstName} {loginUser?.lastName}
                  </p>
                  <p className="username">@{loginUser?.username}</p>
                </div>
              </div>
              <div className="sections">
                <div
                  onClick={() => {
                    navigate("/myProfile");
                  }}
                  className="section"
                >
                  <FontAwesomeIcon icon={faUser} />
                  <p className="text">My Profile</p>
                </div>
                <div
                  onClick={() => {
                    navigate("/editProfile");
                  }}
                  className="section"
                >
                  <FontAwesomeIcon icon={faPen} />
                  <p className="text">Edit Profile</p>
                </div>
                <div
                  onClick={() => navigate(`/blockList/${loginUser._id}`)}
                  className="section"
                >
                  <FontAwesomeIcon icon={faBan} />
                  <p className="text">Blocked</p>
                </div>
                <div
                  onClick={() => {
                    localStorage.removeItem("id");
                    navigate("/login");
                  }}
                  className="section"
                >
                  <FontAwesomeIcon icon={faArrowRightFromBracket} />
                  <p className="text">Log Out</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
});

export default Navbar;

import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { UserPost } from "../../redux/slices/userSlice";
import { RootState } from "../../redux/store/store";
import { useEffect, memo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  addComment,
  addLike,
  deleteLike,
  deletePost,
  UnFollowing,
  addSave,
  deleteSave,
  getLoginUser,
} from "../../redux/slices/userSlice";
import { userObject, deleteComment } from "../../redux/slices/userSlice";
import { AppDispatch } from "../../redux/store/store";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Swal from "sweetalert2";
import "./postCard.scss";
import { useNavigate } from "react-router-dom";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

interface PostCardProps {
  key: string;
  post: UserPost;
  id: string |undefined;
}
const PostCard = memo(({ post, id }: PostCardProps) => {
  const isAdmin = localStorage.getItem("isAdmin")
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [like, setLike] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [commentValue, setCommentValue] = useState<string>("");
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const idlogin: string = JSON.parse(
    localStorage.getItem("id") ?? "null"
  ) as string;
  const loginUser: userObject | undefined = users.find(
    (Elem) => Elem._id == idlogin
  );
  const getAllUsersAction = useCallback(() => dispatch(getAllUsers()), [
    dispatch,
  ]);
  const getLoginUserAction = useCallback(
    () => dispatch(getLoginUser(idlogin)),
    [dispatch, idlogin]
  );

  useEffect(() => {
    console.log(post.comments);
    if (like) {
      getAllUsersAction();
      getLoginUserAction();
    }
  }, [getAllUsersAction, getLoginUserAction]);
  const user: userObject | undefined = users.find((elem) => elem._id == id);
  let items: MenuProps["items"] = [];

  if (loginUser?.posts?.find((elem) => elem?.id === post?.id)) {
    items = [
      {
        key: "1",
        label: (
          <p
            onClick={() => {
              dispatch(
                deletePost({
                  loginId: loginUser?._id,
                  postId: post.id,
                })
              );
            }}
            className="dropDown deleteDropDown"
          >
            Delete
          </p>
        ),
      },
    ];
  } else {
    items = [
      {
        key: "1",
        label: (
          <p
            onClick={() => {
              dispatch(
                UnFollowing({
                  loginId: loginUser?._id,
                  userId: id,
                })
              );
            }}
            className="dropDown unfollowDropDown"
          >
            Unfollow
          </p>
        ),
      },
    ];
  }

  return (
    <section id="PostCard">
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div className="left">
              <img src={post?.imgSRC} alt="" />
            </div>
            <div className="rightt">
              <div className="username-profilee">
                <div className="left">
                  <div className="profile">
                    <img
                      src="https://demo.foxthemes.net/socialite-v3.0/assets/images/avatars/avatar-2.jpg"
                      alt=""
                    />
                  </div>
                  <div className="username">
                    <p className="name">{user?.username}</p>
                  </div>
                </div>
                <div className="right">
                  <div>
                    <Dropdown menu={{ items }}>
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          <FontAwesomeIcon icon={faEllipsis} />
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                </div>
              </div>
              <div className="comments">
                {post?.comments &&
                  post.comments.map((element) => {
                    const commentUser = users?.find(
                      (elem) => elem?._id == element.commentId
                    );
                    return (
                      <div key={element.id} className="comment">
                        <div
                          onClick={() => {
                            navigate(`/userProfile/${element.commentId}`);
                          }}
                          className="left"
                        >
                          <div className="profile">
                            <img src={commentUser?.profileImage} alt="" />
                          </div>
                          <div className="name-textComment">
                            <p className="name">{commentUser?.username}</p>
                            <p className="commentText">{element.text}</p>
                          </div>
                        </div>
                        {element.commentId == loginUser?._id ||
                        loginUser?.posts?.find((elem) => elem.id == post.id) ? (
                          <div
                            onClick={() => {
                              console.log("commentId", element.id);

                              dispatch(
                                deleteComment({
                                  postId: post.id,
                                  kiminPostudur: id,
                                  loginId: loginUser?._id,
                                  commentId: element.id,
                                })
                              );
                              setLike(true);
                            }}
                            className="right"
                          >
                            <p className="delete">Delete</p>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
              {isAdmin ? null :  <div
                onClick={(e) => e.stopPropagation()}
                className="like-comment-save"
              >
                <div className="like-comment">
                  <div className="like">
                    {post?.likes &&
                    post?.likes?.find(
                      (elem) => elem.likeId == loginUser?._id
                    ) ? (
                      <FontAwesomeIcon
                        onClick={() => {
                          dispatch(
                            deleteLike({
                              postId: post.id,
                              kiminPostudur: id,
                              loginId: loginUser?._id,
                            })
                          );
                          setLike(true);
                        }}
                        style={{ color: "red" }}
                        icon={faHeart}
                      />
                    ) : (
                      <FontAwesomeIcon
                        onClick={() => {
                          if (loginUser?.report) {
                            Swal.fire({
                              icon: "error",
                              title: "Oops...",
                              text: "you are blocked!",
                            });
                          } else {
                            dispatch(
                              addLike({
                                kiminPostudur: id,
                                postId: post.id,
                                loginId: loginUser?._id,
                              })
                            );
                            setLike(true);
                          }
                        }}
                        icon={faHeart}
                      />
                    )}
                    <span>{post?.likes.length} likes</span>
                  </div>
                  <div className="comment">
                    <FontAwesomeIcon icon={faCommentDots} />
                    <span>{post?.comments.length}</span>
                  </div>
                </div>
                {loginUser?.saved?.find(
                  (Elem) => Elem.postId == post.id && Elem.whosePostId == id
                ) ? (
                  <div className="save">
                    <FontAwesomeIcon
                      onClick={() => {
                        dispatch(
                          deleteSave({
                            postId: post.id,
                            whosePostId: id,
                            loginId: loginUser._id,
                          })
                        );
                        setLike(true);
                      }}
                      style={{ color: "rgb(17, 104, 217)" }}
                      icon={faBookmark}
                    />
                  </div>
                ) : (
                  <div className="save">
                    <FontAwesomeIcon
                      onClick={() => {
                        dispatch(
                          addSave({
                            postId: post.id,
                            whosePostId: id,
                            loginId: loginUser?._id,
                          })
                        );
                        setLike(true);
                      }}
                      icon={faBookmark}
                    />
                  </div>
                )}
              </div> }
             
              {isAdmin ? null : <div onClick={(e) => e.stopPropagation()} className="addComment">
                <div className="left">
                  <div className="imageComment">
                    <img src={loginUser?.profileImage} alt="" />
                  </div>
                  <input
                    onChange={(e) => {
                      setCommentValue(e.target.value);
                    }}
                    placeholder="Add Comment..."
                    type="text"
                    value={commentValue}
                  />
                </div>
                <div className="right">
                  <button
                    onClick={() => {
                      if (loginUser?.report) {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "you are blocked!",
                        });
                      }
                      if (commentValue && loginUser?.report == false) {
                        dispatch(
                          addComment({
                            kiminPostudur: id,
                            postId: post.id,
                            loginId: loginUser?._id,
                            text: commentValue,
                          })
                        );
                        setLike(true);
                        setCommentValue("");
                      } else if (!commentValue) {
                        Swal.fire({
                          icon: "error",
                          title: "Oops...",
                          text: "you didn't write anything!",
                        });
                        setLike(true);
                        handleOpen();
                      }
                    }}
                  >
                    Share
                  </button>
                </div>
              </div> }
              
            </div>
          </Box>
        </Modal>
      </div>
      <div className="post">
        <div className="username-profile">
          <div
            onClick={(e) => {
              e.stopPropagation();
              {
                id ? navigate(`/userProfile/${id}`) : null;
              }
            }}
            className="left"
          >
            <div className="profile">
              <img src={user?.profileImage} alt="" />
            </div>
            <div className="username">
              <p className="name">{user?.username}</p>
            </div>
          </div>
          <div className="right">
            <div>
              <Dropdown menu={{ items }}>
                <a onClick={(e) => e.preventDefault()}>
                  <Space>
                    <FontAwesomeIcon icon={faEllipsis} />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        </div>
        <div onClick={handleOpen} className="image">
          <img src={post?.imgSRC} alt="" />
        </div>
       {isAdmin ? null : <div onClick={(e) => e.stopPropagation()} className="like-comment-save">
          <div className="like-comment">
            <div className="like">
              {post?.likes &&
              post?.likes?.find((elem) => elem.likeId == loginUser?._id) ? (
                <FontAwesomeIcon
                  onClick={() => {
                    dispatch(
                      deleteLike({
                        postId: post.id,
                        kiminPostudur: id,
                        loginId: loginUser?._id,
                      })
                    );
                    setLike(true);
                  }}
                  style={{ color: "red" }}
                  icon={faHeart}
                />
              ) : (
                <FontAwesomeIcon
                  onClick={() => {
                    if (loginUser?.report) {
                      Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "you are blocked!",
                      });
                    } else {
                      dispatch(
                        addLike({
                          kiminPostudur: id,
                          postId: post.id,
                          loginId: loginUser?._id,
                        })
                      );
                      setLike(true);
                    }
                  }}
                  icon={faHeart}
                />
              )}

              <span>{post?.likes.length} likes</span>
            </div>
            <div onClick={handleOpen} className="comment">
              <FontAwesomeIcon icon={faCommentDots} />
              <span>{post?.comments.length} comments</span>
            </div>
          </div>
          {loginUser?.saved?.find((Elem) => Elem.postId == post.id) ? (
            <div className="save">
              <FontAwesomeIcon
                onClick={() => {
                  dispatch(
                    deleteSave({
                      postId: post.id,
                      whosePostId: id,
                      loginId: loginUser?._id,
                    })
                  );
                  setLike(true);
                }}
                style={{ color: "rgb(17, 104, 217)" }}
                icon={faBookmark}
              />
            </div>
          ) : (
            <div className="save">
              <FontAwesomeIcon
                onClick={() => {
                  dispatch(
                    addSave({
                      postId: post.id,
                      whosePostId: id,
                      loginId: loginUser?._id,
                    })
                  );
                  setLike(true);
                }}
                icon={faBookmark}
              />
            </div>
          )}
        </div>}
        {post?.title ? (
          <div className="postDescription">
            <p className="usernameText">{user?.username}</p>
            <p className="description">{post?.title}</p>
          </div>
        ) : null}

        <div className="comments">
          <div onClick={handleOpen} className="moreComment">
            <span>View all {post?.comments.length} comments</span>
          </div>
        </div>
        {isAdmin ? null : <div onClick={(e) => e.stopPropagation()} className="addComment">
          <div className="left">
            <div className="imageComment">
              <img src={loginUser?.profileImage} alt="" />
            </div>
            <input
              onChange={(e) => {
                setCommentValue(e.target.value);
              }}
              placeholder="Add Comment..."
              type="text"
              value={commentValue}
            />
          </div>
          <div className="right">
            <button
              onClick={() => {
                if (loginUser?.report) {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "you are blocked!",
                  });
                }
                if (commentValue && loginUser?.report == false) {
                  dispatch(
                    addComment({
                      kiminPostudur: id,
                      postId: post.id,
                      loginId: loginUser?._id,
                      text: commentValue,
                    })
                  );
                  setLike(true);
                  setCommentValue("");
                } else if (!commentValue) {
                  Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "you didn't write anything!",
                  });
                  setLike(true);
                  handleOpen();
                }
              }}
            >
              Share
            </button>
          </div>
        </div>}
        
      </div>
    </section>
  );
});

export default PostCard;

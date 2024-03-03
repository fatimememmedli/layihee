import Navbar from "../../components/navbar/Navbar";
import NavbarLeft from "../../components/navbarLeft/NavbarLeft";
import SuggestedCard from "../../components/suggestedCard/SuggestedCard";
import { AppDispatch } from "../../redux/store/store";
import {
  getAllUsers,
  userObject,
  addFollowing,
  UnFollowing,
  sendRequest,
  unRequest,
} from "../../redux/slices/userSlice";
import { RootState } from "../../redux/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import "./suggested.scss";

function Suggested() {
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const id: string = JSON.parse(localStorage.getItem("id") ?? "null") as string;
  const loginUser: userObject = users?.find(
    (elem: userObject) => elem._id == id
  )!;
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <NavbarLeft />
      <SuggestedCard />
      <section id="Suggestions">
        <div className="head">
          <p>Suggestions</p>
        </div>
        <div className="users">
          {users &&
            users.map((user) => {
              if (
                user._id != loginUser._id &&
                user.isAdmin != true &&
                !loginUser.blockList.find((elem) => elem.id == user._id &&  !loginUser.blockList.find((elem)=> elem.id==user._id))
              ) {
                // && !loginUser.blockList.find((elem)=> elem.id==user._id)
                return (
                  <div
                    onClick={() => navigate(`/userProfile/${user._id}`)}
                    key={user._id}
                    className="user"
                  >
                    <div className="image">
                      <img src={user?.profileImage} alt="" />
                    </div>
                    <div className="name-follow">
                      <p className="name">{user?.username}</p>
                      <p className="followers">
                        {user?.follower?.length} Following
                      </p>
                      <div className="button">
                        {user?.requests?.find(
                          (elem) => elem.id === loginUser._id
                        ) ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                unRequest({
                                  loginId: loginUser._id,
                                  userId: user._id,
                                })
                              );
                            }}
                          >
                            Requested
                          </button>
                        ) : loginUser?.following?.find(
                            (elem) => elem.id == user._id
                          ) ? (
                          <button
                            className=".buttonUnfollow"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(
                                UnFollowing({
                                  loginId: loginUser._id,
                                  userId: user._id,
                                })
                              );
                            }}
                          >
                            Unfollow
                          </button>
                        ) : (
                          <button
                            className="buttonFollow"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (user.isPublic) {
                                dispatch(
                                  addFollowing({
                                    loginId: loginUser._id,
                                    userId: user._id,
                                  })
                                );
                              } else {
                                dispatch(
                                  sendRequest({
                                    loginId: loginUser._id,
                                    userId: user._id,
                                  })
                                );
                              }
                            }}
                          >
                            Follow
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </section>
    </>
  );
}

export default Suggested;

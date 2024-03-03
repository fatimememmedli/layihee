import { AppDispatch } from "../../redux/store/store";
import {
  getAllUsers,
  userObject,
  addFollowing,
  UnFollowing,
  sendRequest,
  unRequest,
} from "../../redux/slices/userSlice";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../redux/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "./suggestedCard.scss";
function SuggestedCard() {
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const id: string | null = JSON.parse(localStorage.getItem("id"));
  const loginUser: userObject = users.find(
    (elem: userObject) => elem?._id == id
  )!;
  console.log(loginUser);
  const navigate = useNavigate();
  return (
    <section id="suggested-card">
      <div className="head">
        <div className="left">
          <p>People you may know</p>
        </div>
        <div onClick={() => navigate("/suggestions")} className="right">
          <p>See all</p>
        </div>
      </div>
      <div className="suggests">
        {users &&
          users.map((user) => {
            if (
              user?._id != loginUser?._id &&
              user?.isAdmin != true &&
              !loginUser.blockList.find((elem) => elem.id == user._id)
            ) {
              return (
                <div key={uuidv4()} className="suggest">
                  <div
                    onClick={() => {
                      navigate(`/userProfile/${user?._id}`);
                    }}
                    className="profile-name"
                  >
                    <div className="profile">
                      <img src={user?.profileImage} alt="" />
                    </div>
                    <div className="name-followers">
                      <p className="name">{user?.username}</p>
                      <p className="followers">
                        {user?.follower?.length} Followers
                      </p>
                    </div>
                  </div>
                  <div className="button">
                    {loginUser?.following?.find(
                      (elem) => elem.id == user?._id
                    ) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            UnFollowing({
                              loginId: loginUser?._id,
                              userId: user?._id,
                            })
                          );
                        }}
                      >
                        unfollow
                      </button>
                    ) : user?.requests?.find(
                        (elem) => elem.id == loginUser?._id
                      ) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            unRequest({
                              loginId: loginUser?._id,
                              userId: user?._id,
                            })
                          );
                        }}
                      >
                        requested
                      </button>
                    ) : (
                      <button
                        className="follow-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (user.isPublic) {
                            dispatch(
                              addFollowing({
                                loginId: loginUser?._id,
                                userId: user?._id,
                              })
                            );
                          } else {
                            dispatch(
                              sendRequest({
                                loginId: loginUser?._id,
                                userId: user?._id,
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
              );
            }
          })}
      </div>
    </section>
  );
}

export default SuggestedCard;

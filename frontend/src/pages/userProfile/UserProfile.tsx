import Navbar from "../../components/navbar/Navbar";
import NavbarLeft from "../../components/navbarLeft/NavbarLeft";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import PostCard from "../../components/postCard/PostCard";
import "./userProfile.scss";
import {
  getAllUsers,
  userObject,
  UnFollowing,
  addFollowing,
  sendRequest,
  unRequest,
  addBlockList,
  UnBlock,
} from "../../redux/slices/userSlice";
import { useParams } from "react-router-dom";
import { AppDispatch } from "../../redux/store/store";
import { RootState } from "../../redux/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
function UserProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [stateDispatch, setstateDispatch] = useState(false);
  console.log(id);
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const userProfileData = useMemo(() => {
    console.log("useMemo çalıştı"); // Örnek amaçlı, konsol log'unu ekledik
    const ProfileUser: userObject = users.find(
      (elem: userObject) => elem?._id === id
    )!;
    const idlogin: string = JSON.parse(
      localStorage.getItem("id") ?? "null"
    ) as string;
    const loginUser: userObject = users.find(
      (elem: userObject) => elem?._id === idlogin
    )!;

    return {
      ProfileUser,
      loginUser,
    };
  }, [users, id]);

  useEffect(() => {
    if (stateDispatch) {
      dispatch(getAllUsers());
    }
  }, [dispatch]);

  if (!userProfileData.ProfileUser) {
    // İstediğiniz bir yükleme durumu veya hata durumu işlemini ekleyebilirsiniz.
    return <p>Loading...</p>;
  }
  console.log("userProdu");
  const { ProfileUser, loginUser } = userProfileData;
  return (
    <>
      <Navbar />
      <NavbarLeft />
      <section id="UserProfile">
        <div className="profile">
          <div className="head-image">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/group/group-cover-4.jpg"
              alt=""
            />
          </div>
          <div className="info-profile">
            <div className="left">
              <div className="image">
                <img src={ProfileUser?.profileImage} alt="" />
              </div>
              <div className="name-followers-bio">
                <p className="username">@{ProfileUser?.username}</p>
                <p className="name">
                  {ProfileUser?.firstName} {ProfileUser?.lastName}
                </p>
                <div className="follower-following">
                  <p
                    onClick={() => navigate(`/followers/${ProfileUser._id}`)}
                    className="followers text"
                  >
                    {ProfileUser?.follower.length} <span>followers</span>
                  </p>
                  <p
                    onClick={() => navigate(`/following/${ProfileUser._id}`)}
                    className="following text"
                  >
                    {ProfileUser?.following.length} <span>following</span>
                  </p>
                </div>
                <div className="bio">
                  <p>{ProfileUser?.bio}</p>
                </div>
              </div>
            </div>
            {loginUser?._id != id ? (
              <div className="right">
                {/* <div className="chat button">
                  <FontAwesomeIcon icon={faMessage} />
                  <span>Chat</span>
                </div> */}
                {loginUser?.blockList.find((elem) => elem.id == id) ? (
                  <div
                    onClick={() => {
                      dispatch(
                        UnBlock({
                          loginId: loginUser?._id,
                          userId: id,
                        })
                      );
                    }}
                    className="blocked button"
                  >
                    <span>Unblock</span>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      dispatch(
                        addBlockList({
                          loginId: loginUser?._id,
                          userId: id,
                        })
                      );
                      setstateDispatch(true)
                    }}
                    className="block button"
                  >
                    <FontAwesomeIcon icon={faBan} />
                    <span>Block</span>
                  </div>
                )}

                {!loginUser?.blockList.find((elem) => elem.id == id) &&
                ProfileUser?.requests.find(
                  (elem) => elem.id === loginUser?._id
                ) ? (
                  <div
                    onClick={() => {
                      dispatch(
                        unRequest({
                          loginId: loginUser?._id,
                          userId: ProfileUser?._id,
                        })
                      );
                      setstateDispatch(true)

                    }}
                    className="requested button"
                  >
                    <span>Requested</span>
                  </div>
                ) : !loginUser?.blockList.find((elem) => elem.id == id) &&
                  loginUser?.following.find(
                    (elem) => elem.id == ProfileUser?._id
                  ) ? (
                  <div
                    onClick={() => {
                      dispatch(
                        UnFollowing({
                          loginId: loginUser?._id,
                          userId: ProfileUser?._id,
                        })
                      );
                      setstateDispatch(true)

                    }}
                    className="unfollow button"
                  >
                    <span>Unfollow</span>
                  </div>
                ) : !loginUser?.blockList.find((elem) => elem.id == id) ? (
                  <div
                    onClick={() => {
                      if (ProfileUser.isPublic) {
                        dispatch(
                          addFollowing({
                            loginId: loginUser?._id,
                            userId: ProfileUser?._id,
                          })
                        );
                      setstateDispatch(true)

                      } else {
                        dispatch(
                          sendRequest({
                            loginId: loginUser?._id,
                            userId: ProfileUser?._id,
                          })
                        );
                      setstateDispatch(true)

                      }
                    }}
                    className="follow button"
                  >
                    <FontAwesomeIcon icon={faUserPlus} />
                    <span>Follow</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>

        <div className="posts">
          {ProfileUser?.isPublic == false &&
          !loginUser?.following.find((elem) => elem.id == ProfileUser._id) ? (
            <div className="no-posts">
              <FontAwesomeIcon icon={faLock} />
              <p className="noPosts">This account is private</p>
            </div>
          ) : ProfileUser?.posts.length == 0 ? (
            <div className="no-posts">
              <FontAwesomeIcon icon={faImage} />
              <p className="noPosts">No posts yet</p>
            </div>
          ) : (
            ProfileUser?.posts &&
            ProfileUser?.posts
              ?.slice()
              .reverse()
              .map((post) => {
                return (
                  <PostCard key={uuidv4()} post={post} id={ProfileUser?._id} />
                );
              })
          )}
        </div>
      </section>
    </>
  );
}

export default UserProfile;

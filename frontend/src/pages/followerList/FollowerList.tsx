// import { Params, useParams } from "react-router-dom";
// import Navbar from "../../components/navbar/Navbar";
// import NavbarLeft from "../../components/navbarLeft/NavbarLeft";
// import SuggestedCard from "../../components/suggestedCard/SuggestedCard";
// import { v4 as uuidv4 } from "uuid";
// import { RootState } from "../../redux/store/store";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch } from "../../redux/store/store";
// import {
//   getAllUsers,
//   getAllUsersById,
//   userObject,
//   getLoginUser,
//   UnBlock,
//   addFollowing,
//   unRequest,
//   UnFollowing,
//   sendRequest,
// } from "../../redux/slices/userSlice";

function FollowerList() {
  // const { id }: Readonly<Params<string>> | undefined = useParams();
  // const user = useSelector((state: RootState) => state.users.user);
  // const LoginUser = useSelector((state: RootState) => state.users.login);
  // const users = useSelector((state: RootState) => state.users.users);
  // console.log(user);
  // const idLogin: string = JSON.parse(
  //   localStorage.getItem("id") ?? "null"
  // ) as string;
  // const dispatch: AppDispatch = useDispatch<AppDispatch>();
  // useEffect(() => {
  //   dispatch(getAllUsers());
  //   if (id) {
  //     dispatch(getAllUsersById(id));
  //   }
  //   dispatch(getLoginUser(idLogin));
  // }, [dispatch, idLogin, id]);
  return (
    <>
      {/* <Navbar />
      <NavbarLeft />

      <SuggestedCard />
      <section id="userList">
        <div className="head">Followers</div>
        <div className="users">
          {user.follower &&
            user?.follower?.map((listObj) => {
              const find: userObject | undefined = users?.find(
                (elem) => elem._id == listObj.id
              );
              return (
                <div key={uuidv4()} className="user">
                  <div className="left">
                    <div className="profile">
                      <img
                        src={find?.profileImage}
                        alt=""
                      />
                    </div>
                    <div className="username-firtlastName">
                      <p className="username">{find?.username}</p>
                      <p className="firstLastName">
                        {find?.firstName} {find?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="right">
                    {LoginUser?.blockList?.find(
                      (elem) => elem.id == find?._id
                    ) ? (
                      <button
                        onClick={() => {
                          dispatch(
                            UnBlock({
                              loginId: LoginUser?._id,
                              userId: find?._id,
                            })
                          );
                        }}
                      >
                        Unblock
                      </button>
                    ) : LoginUser?.following?.find(
                        (elem) => elem.id == find?._id
                      ) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            UnFollowing({
                              loginId: LoginUser?._id,
                              userId: find?._id,
                            })
                          );
                        }}
                      >
                        Unfollow
                      </button>
                    ) : find?.requests.find(
                        (elem) => elem.id == LoginUser._id
                      ) ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(
                            unRequest({
                              loginId: LoginUser?._id,
                              userId: find?._id,
                            })
                          );
                        }}
                      >
                        Requested
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (user.isPublic) {
                            dispatch(
                              addFollowing({
                                loginId: LoginUser?._id,
                                userId: find?._id,
                              })
                            );
                          } else {
                            dispatch(
                              sendRequest({
                                loginId: LoginUser?._id,
                                userId: find?._id,
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
            })}
        </div>
      </section> */}
    </>
  );
}

export default FollowerList;

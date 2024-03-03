import "./userlist.scss";
import { v4 as uuidv4 } from "uuid";
import { RootState } from "../../redux/store/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import {
  getAllUsers,
  userObject,
  UnBlock,
  getLoginUser,
} from "../../redux/slices/userSlice";
import { Follow } from "../../redux/slices/userSlice";
interface Props {
  type: string;
  list: Follow[];
  user: userObject;
}

function UserList({ type, list, user }: Props) {
  console.log(list)
  const idLogin: string = JSON.parse(
    localStorage.getItem("id") ?? "null"
  ) as string;
  const users = useSelector((state: RootState) => state.users.users);
  const [statedispatch, setStatedispatch] = useState(false)
  const userLogin: userObject = useSelector(
    (state: RootState) => state.users.login
  );
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if(statedispatch){
      dispatch(getAllUsers());
      dispatch(getLoginUser(idLogin));
    }
  }, [dispatch]);
  return (
    <section id="userList">
      <div className="head">{type}</div>
      <div className="users">
        {list?.map((listObj) => {
            const find: userObject | undefined = users.find(
              (elem) => elem._id == listObj.id
            );
            return (
              <div key={uuidv4()} className="user">
                <div className="left">
                  <div className="profile">
                    <img
                      src="https://demo.foxthemes.net/socialite-v3.0/assets/images/avatars/avatar-6.jpg"
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
                  {type == "Blocklist" ? (
                    <button
                      onClick={() => {
                        dispatch(
                          UnBlock({
                            loginId: user?._id,
                            userId: find?._id,
                          })
                        );
                        setStatedispatch(true)
                      }}
                    >
                      Unblock
                    </button>
                  ) : userLogin.following.find(
                      (elem) => elem.id == find?._id
                    ) ? (
                    <button>Unfollow</button>
                  ) : find?.requests.find(
                      (elem) => elem.id == userLogin._id
                    ) ? (
                    <button>Requested</button>
                  ) : (
                    <button>Follow</button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}

export default UserList;

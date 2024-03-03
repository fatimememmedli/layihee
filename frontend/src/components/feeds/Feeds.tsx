import "./feed.scss";
import PostCard from "../postCard/PostCard";
import { useState, useEffect } from "react";
import { AppDispatch } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, userObject } from "../../redux/slices/userSlice";
import { RootState } from "../../redux/store/store";
import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";
function Feeds() {
  const users = useSelector((state: RootState) => state.users.users);
  const [id, setId] = useState<string>("");
  const dispatch: AppDispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllUsers());
    const idlogin: string = JSON.parse(
      localStorage.getItem("id") ?? "null"
    ) as string;
    setId(idlogin);
  }, [dispatch]);
  console.log(users)
  const loginUser: userObject = users.find(
    (elem: userObject) => elem._id == id
  )!;
  const loginUserMemo = useMemo(() => {
    return users.find((elem: userObject) => elem._id == id)!;
  }, [users, id]);
  return (
    <section id="feed">
      <div className="posts">
        {loginUser?.following?.map((element) => {
          const user = users.find((elem) => elem._id == element.id);
          return user?.posts?.slice()
          .reverse().map((post) => (
            <PostCard key={uuidv4()} post={post} id={user?._id} />
          ));
        })}
      </div>
    </section>
  );
}

export default Feeds;

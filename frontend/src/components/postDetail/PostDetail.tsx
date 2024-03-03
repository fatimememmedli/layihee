// import React, { useEffect, useMemo } from "react";
// import Navbar from "../navbar/Navbar";
// import NavbarLeft from "../navbarLeft/NavbarLeft";
// import PostCard from "../postCard/PostCard";
// import "./postDetail.scss";
// import { useParams } from "react-router-dom";
// import { RootState } from "../../redux/store/store";
// import { AppDispatch } from "../../redux/store/store";
// import { useDispatch, useSelector } from "react-redux";
// import { v4 as uuidv4 } from "uuid";
// import { getAllUsers, userObject, UserPost } from "../../redux/slices/userSlice";

// function PostDetail() {
//   const { id } = useParams();
//   const users = useSelector((state: RootState) => state.users.users);
//   const dispatch: AppDispatch = useDispatch<AppDispatch>();
//   const idlogin: string = JSON.parse(localStorage.getItem("id") ?? "null") as string;
//   const loginUser: userObject = users.find((elem: userObject) => elem._id == idlogin)!;
// console.log(id)
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!users.length) {
//         await dispatch(getAllUsers());
//       }
//     };

//     fetchData();
//   }, [dispatch, users.length]);

//   // const post: UserPost | undefined = useMemo(() => {
//   //   if (loginUser && loginUser.posts) {
//   //     return loginUser.posts.find((elem: UserPost) => elem.id == id);
//   //   }
//   //   return undefined;
//   // }, [loginUser, id]);
//   // console.log(post);


//   return (
//     <>
//       <Navbar />
//       <NavbarLeft />
//       <section id="postDetail">
//         {/* <div className="posts">
//           {post && <PostCard key={uuidv4()} post={post} id={loginUser?._id} />}
//         </div> */}
//       </section>
//     </>
//   );
// }

// export default PostDetail;

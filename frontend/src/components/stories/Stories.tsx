import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./stories.scss";
import { Pagination } from "swiper/modules";
import { RootState } from "../../redux/store/store";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import { getAllUsers, userObject } from "../../redux/slices/userSlice";
import Box from "@mui/material/Box";
import StoryModalContent from "../storyModalContent/StoryModalContent";
import Modal from "@mui/material/Modal";
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
type Swiper =  any;
function Stories() {
  const [selectedUser, setSelectedUser] = useState<userObject | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const swiperRef = useRef<Swiper | null>(null);
  const [usersIndex, setUsersIndex] = useState<number>(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState<number>(0);
  const users = useSelector((state: RootState) => state.users.users);
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const idlogin: string = JSON.parse(
    localStorage.getItem("id") ?? "null"
  ) as string;
  const loginUser: userObject = users.find(
    (elem: userObject) => elem._id === idlogin
  )!;
  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const handleClose = () => {
    setUsersIndex(0);
    setOpen(false);
  };

  const handlePrevStory = () => {
    if (loginUser && loginUser.following) {
      const newIndex =
        (usersIndex - 1 + loginUser.following.length) %
        loginUser.following.length;
      setUsersIndex(newIndex);
      setCurrentStoryIndex(0);
  
      const prevUserId: string | undefined = loginUser.following[newIndex]?.id;
  
      if (prevUserId !== undefined) {
        const prevUser = users.find((user) => user._id === prevUserId);
  
        if (prevUser && prevUser.stories && prevUser.stories.length > 0) {
          handleStoryClick(prevUser, 0, newIndex);
        }
      }
    }
  };

  const handleNextStory = () => {
    if (loginUser && loginUser.following) {
      const newIndex = (usersIndex + 1) % loginUser.following.length;
      setUsersIndex(newIndex);
      setCurrentStoryIndex(0);
      const nextUserId: string | undefined = loginUser.following[newIndex]?.id;

      if (nextUserId !== undefined) {
        const nextUser = users.find((user) => user._id === nextUserId);

        if (nextUser && nextUser.stories && nextUser.stories.length > 0) {
          handleStoryClick(nextUser, currentStoryIndex, newIndex);
        }
      }
    }
  };
  const handleSlideChange = (swiper: Swiper) => {
    setCurrentStoryIndex(swiper.activeIndex);
  };

  const handleStoryClick = (
    user: userObject,
    storyIndex: number,
    userIndex: number
  ) => {
    setSelectedUser(user);
    setCurrentStoryIndex(storyIndex);
    setUsersIndex(userIndex);
    setOpen(true);
  };

  const handleNextButtonClick = () => {
    handleNextStory();
  };
  return (
    <>
      <section id="stories">
        <Swiper
          ref={(ref) => (swiperRef.current = ref)}
          navigation={true}
          slidesPerView={8}
          spaceBetween={20}
          onSlideChange={(swiper) => handleSlideChange(swiper)}
          breakpoints={{
            640: {
              slidesPerView: 6,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 7,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 9,
              spaceBetween: 10,
            },
            474: {
              slidesPerView: 7,
              spaceBetween: 10,
            },
          }}
          modules={[Navigation, Pagination]}
          className="mySwiper"
        >
          <div className="sliders">
            <SwiperSlide>
              <div
                className="create story"
                onClick={() => handleStoryClick(loginUser, 0, 0)}
              >
                <FontAwesomeIcon icon={faCamera} />
              </div>
            </SwiperSlide>
            {loginUser?.following?.map((elem, index) => {
              const followingUser: userObject | undefined = users.find(
                (user) => elem && user._id === elem.id
              );

              if (followingUser?.stories && followingUser?.stories.length > 0) {
                return (
                  <SwiperSlide
                    key={followingUser?._id}
                    onClick={() => handleStoryClick(followingUser, 0, index)}
                  >
                    <div className="story border">
                      <img src={followingUser.profileImage} alt="" />
                    </div>
                  </SwiperSlide>
                );
              }
              return null;
            })}
          </div>
        </Swiper>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {selectedUser && (
              <StoryModalContent
                selectedUser={selectedUser}
              />
            )}
            <button className="next" onClick={handleNextButtonClick}><FontAwesomeIcon icon={faCircleChevronRight} /></button>
            <button className="prev" onClick={handlePrevStory}><FontAwesomeIcon icon={faCircleChevronLeft} /></button>
            <button className="close" onClick={handleClose}><FontAwesomeIcon icon={faXmark} /></button>
          </Box>
        </Modal>
      </section>
    </>
  );
}

export default Stories;

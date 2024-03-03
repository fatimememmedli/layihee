import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";
import { userObject } from "../../redux/slices/userSlice";
import "./storyModalContent.scss";
interface StoryModalContentProps {
  selectedUser: userObject | null;
}
function StoryModalContent({ selectedUser }: StoryModalContentProps) {
  return (
    <>
      <section id="storyModal">
        <Swiper
          navigation={true}
          slidesPerView={1}
          spaceBetween={0}
          pagination
          modules={[Pagination, Navigation]}
          className="mySwiper"
        >
          <div className="story-modal-content">
            <div className="stories">
              {selectedUser?.stories.map((story, index) => (
                <SwiperSlide key={index}>
                  <div className="storyImage">
                    <img src={story?.imgSRC} alt="" />
                    <div className="profile-username">
                      <div className="profileImage">
                        <img src={selectedUser?.profileImage} alt="" />
                      </div>
                      <p className="username">{selectedUser?.username}</p>
                    </div>
                   {story?.title ?  <div className="description">
                      <p>{story?.title}</p>
                    </div> : null}
                  </div>
                </SwiperSlide>
              ))}
            </div>
          </div>
        </Swiper>
      </section>
    </>
  );
}

export default StoryModalContent;

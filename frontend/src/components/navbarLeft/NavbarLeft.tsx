import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import "animate.css";
import "./navbarLeft.scss";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import { navbarLeftChange } from "../../redux/slices/userSlice";
function NavbarLeft() {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const state: boolean = useSelector(
    (state: RootState) => state.users.navbarLeft
  );
  return (
    <section
      className={state ? "active animate__animated animate__slideInLeft" : ""}
      id="navbarLeft"
    >
      <div className="sections">
        <div
          onClick={() => {
            navigate("/");
            dispatch(navbarLeftChange(false));
          }}
          className="section"
        >
          <div className="img">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/home.png"
              alt=""
            />
          </div>
          <p>Feed</p>
        </div>
        <div
          onClick={() => {
            navigate("/chat");
            dispatch(navbarLeftChange(false));
          }}
          className="section"
        >
          <div className="img">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/message.png"
              alt=""
            />
          </div>
          <p>Messages</p>
        </div>
        <div
          onClick={() => {
            navigate("/suggestions");
            dispatch(navbarLeftChange(false));
          }}
          className="section"
        >
          <div className="img">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/page.png"
              alt=""
            />
          </div>

          <p>Suggestions</p>
        </div>
        <div className="section">
          <div className="img">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/group.png"
              alt=""
            />
          </div>

          <p>Groups</p>
        </div>
        <div className="section">
          <div className="img">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/video.png"
              alt=""
            />
          </div>

          <p>Video</p>
        </div>
        <div className="section">
          <div className="img">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/event.png"
              alt=""
            />
          </div>

          <p>Event</p>
        </div>
        <div className="section">
          <div className="img">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/market.png"
              alt=""
            />
          </div>
          <p>Market</p>
        </div>
        <div className="section">
          <div className="img">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/blog.png"
              alt=""
            />
          </div>

          <p>Blog</p>
        </div>
        <div className="section">
          <div className="img">
            <img
              src="https://demo.foxthemes.net/socialite-v3.0/assets/images/icons/game.png"
              alt=""
            />
          </div>

          <p>Games</p>
        </div>
      </div>
      <div className="pages">
        <div  onClick={() => {
            navigate("/editProfile");
          }} className="page">
          <FontAwesomeIcon icon={faGear} />
          <p>Setting</p>
        </div>
        <div
          onClick={() => {
            localStorage.removeItem("id");
            navigate("/login");
          }}
          className="page"
        >
          <FontAwesomeIcon icon={faArrowRightFromBracket} />
          <p>Log out</p>
        </div>
      </div>
    </section>
  );
}

export default NavbarLeft;

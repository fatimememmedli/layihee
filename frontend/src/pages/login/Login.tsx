import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Swal from "sweetalert2";
import { AppDispatch } from "../../redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store/store";
import { getAllUsers } from "../../redux/slices/userSlice";
import "swiper/css/effect-fade";
import "animate.css";
import "./login.scss";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import axios from "axios";
import { useEffect } from "react";
function Login() {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.users.users);
  console.log(users);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Required"),
      username: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      axios.post("http://localhost:7070/login", values).then((res) => {
        console.log(res);
        if (res.status === 200) {
          const find = users.find((element) => element._id == res.data);
          if (find?.isAdmin) {
            navigate("/admin");
            localStorage.setItem("id", JSON.stringify(res.data));
            localStorage.setItem("isAdmin", "true");
          } else {
            console.log(res);
            // localStorage.setItem("token", res.data.token);
            localStorage.setItem("id", JSON.stringify(res.data));
            navigate("/");
          }
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: res.data,
          });
        }
      });
    },
  });

  return (
    <>
      <div className="login">
        <div className="left">
          <div className="left-container">
            <div className="logo animate__animated animate__fadeIn">
              <img
                src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo.png"
                alt=""
              />
            </div>
            <div className="form">
              <div className="form-head">
                <p className="head animate__animated animate__fadeIn">
                  Sign in to your account
                </p>
                <p className="text animate__animated animate__fadeIn">
                  If you haven’t signed up yet.{" "}
                  <span
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Register here!
                  </span>
                </p>
              </div>
              <form onSubmit={formik.handleSubmit}>
                <div className="label-input">
                  <label
                    className="animate__animated animate__fadeIn"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    className="animate__animated animate__fadeIn"
                    id="username"
                    name="username"
                    type="username"
                    placeholder="username"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                  />
                  {formik.touched.username && formik.errors.username ? (
                    <div className="error">{formik.errors.username}</div>
                  ) : null}
                </div>

                <div className="label-input">
                  <label
                    className="animate__animated animate__fadeIn"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    className="animate__animated animate__fadeIn"
                    id="password"
                    name="password"
                    placeholder="***"
                    type="password"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error">{formik.errors.password}</div>
                  ) : null}
                </div>

                <button
                  className="animate__animated animate__fadeIn"
                  type="submit"
                >
                  Sign In
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="right">
          <Swiper
            // install Swiper modules
            style={{ height: "100%" }}
            centeredSlides={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            pagination={{ clickable: true }}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log("slide change")}
          >
            <SwiperSlide>
              <div className="image">
                <img
                  src="https://demo.foxthemes.net/socialite-v3.0/assets/images/post/img-3.jpg"
                  alt=""
                />
                <div className="text-logo">
                  <div className="logo">
                    <img
                      src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo-icon.png"
                      alt=""
                    />
                  </div>
                  <div className="text">
                    <p className="head">Connect With Friends</p>
                    <p className="desc">
                      This phrase is more casual and playful. It suggests that
                      you are keeping your friends updated on what’s happening
                      in your life.
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="image">
                <img
                  src="https://demo.foxthemes.net/socialite-v3.0/assets/images/post/img-2.jpg"
                  alt=""
                />
                <div className="text-logo">
                  <div className="logo">
                    <img
                      src="https://demo.foxthemes.net/socialite-v3.0/assets/images/logo-icon.png"
                      alt=""
                    />
                  </div>
                  <div className="text animate__animated animate__fadeIn">
                    <p className="head animate__animated animate__fadeIn">
                      Connect With Friends
                    </p>
                    <p className="desc animate__animated animate__fadeIn">
                      This phrase is more casual and playful. It suggests that
                      you are keeping your friends updated on what’s happening
                      in your life.
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      </div>
    </>
  );
}

export default Login;

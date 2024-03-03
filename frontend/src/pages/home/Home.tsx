import Feeds from "../../components/feeds/Feeds";
import Navbar from "../../components/navbar/Navbar";
import NavbarLeft from "../../components/navbarLeft/NavbarLeft";
import Stories from "../../components/stories/Stories";
import SuggestedCard from "../../components/suggestedCard/SuggestedCard";
import "./home.scss";
function Home() {
  const admin = localStorage.getItem("isAdmin");

  return (
    <div className="Home">
      {admin ? null : (
        <>
          <Navbar />
          <NavbarLeft />
          <Stories />
          <Feeds />
          <SuggestedCard />
        </>
      )}
    </div>
  );
}

export default Home;

import Navbar from '../../components/navbar/Navbar'
import NavbarLeft from '../../components/navbarLeft/NavbarLeft'


function SavePosts() {
  return (
    <div>
        <Navbar/>
        <NavbarLeft/>
        <div className="posts">
        </div>
    </div>
  )
}

export default SavePosts
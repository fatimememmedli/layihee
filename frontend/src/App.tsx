import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./routes/router";
import { Helmet } from "react-helmet";

const router = createBrowserRouter(routes);
function App() {
  return (
    <>
      <Helmet>
        <title>Socialite</title>
        <link rel="icon" href="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" />
      </Helmet>
      <RouterProvider router={router} />
    </>
  );
}

export default App;

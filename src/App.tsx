import { createBrowserRouter } from "react-router-dom";
import { Cadastro } from "./pages/cadastro";
import { Home } from "./pages/home";
import { Login } from "./pages/login";

const router = createBrowserRouter([
  {
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/cadastro",
        element: <Cadastro />,
      },
      {
        path: "/logincliente",
        element: <Login />,
      },
    ],
  },
]);

export { router };

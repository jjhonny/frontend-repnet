import { createBrowserRouter } from "react-router-dom";
import { Cadastro } from "./pages/cadastro";
import { Home } from "./pages/home";
import { LoginC } from "./pages/loginC";
import { LoginR } from "./pages/loginR";

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
        element: <LoginC />,
      },
      {
        path: "/loginrepresentante",
        element: <LoginR />,
      },
    ],
  },
]);

export { router };

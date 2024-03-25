import { Routes, Route } from "react-router-dom";
import { Cadastro } from "./pages/cadastro";
import { Home } from "./pages/home";
import { Login } from "./pages/login";
import { HomeRepre } from "./pages/homeRepre";
import { HomeCliente } from "./pages/homeCliente";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home/representante" element={<HomeRepre />} />
      <Route path="/home/cliente" element={<HomeCliente />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;

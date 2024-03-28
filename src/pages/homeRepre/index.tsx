import { Link } from "react-router-dom";

export function HomeRepre() {
  return (
    <div className="flex h-screen flex-col justify-center items-center">
      <h1 className="text-5xl">Pagina Home Representante</h1>
      <span>
        <Link to="/login">Pagina Login</Link>
      </span>
    </div>
  );
}

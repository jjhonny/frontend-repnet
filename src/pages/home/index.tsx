import { Link } from "react-router-dom";

export function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-5xl">Bem Vindo!!</h1>
      <span>
        <Link to="/login">Pagina Login</Link>
      </span>
    </div>
  );
}

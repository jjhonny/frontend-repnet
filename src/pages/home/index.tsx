import { Link } from "react-router-dom";

export function Home() {
  return (
    <div>
      <h1 className="flex justify-center text-5xl">Pagina Home</h1>
      <span>
        <Link to="/logincliente">Pagina Login</Link>
      </span>
    </div>
  );
}

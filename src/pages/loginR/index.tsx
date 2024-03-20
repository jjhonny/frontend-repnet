import { useState, FormEvent } from "react";
import { Input } from "../../components/Input";
import { FaKey, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export function LoginR() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event: FormEvent) {
    event.preventDefault();
    console.log(user);
    console.log(password);
  }

  return (
    <>
      <main className="w-full h-screen flex justify-center items-center flex-col">
        <div className="bg-white w-full max-w-xl p-10 flex flex-col rounded-lg shadow-lg">
          <div className="w-full flex justify-center">
            <h1 className="font-bold text-4xl mb-4">Área Representante</h1>
          </div>
          <div className="w-full">
            <form>
              <span className="font-bold">Usuario</span>
              <Input
                type="text"
                className="grow"
                placeholder="Digite seu usuario"
                icon={<FaUser />}
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <span className="font-bold">Senha</span>
              <Input
                type="password"
                className="grow"
                placeholder="Digite sua senha"
                icon={<FaKey />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex flex-row justify-between pt-3">
                <a className="link link-hover opacity-90">
                  Esqueceu sua senha?
                </a>
                <a className="link link-hover opacity-90">
                  <Link to="/cadastro">Criar conta</Link>
                </a>
              </div>
              <div className="flex">
                <a className="link link-hover opacity-90">
                  <Link to="/logincliente">Não é um Representante?</Link>
                </a>
              </div>
              <div className="flex justify-center items-center mt-5">
                <button
                  className="btn btn-neutral w-full"
                  onClick={handleLogin}
                >
                  Entrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

import { useState, FormEvent } from "react";
import { InputText } from "../../components/InputText";
import { FaKey, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Login() {
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
        <div className="bg-white w-full max-w-lg p-10 flex flex-col rounded-lg shadow-lg">
          <div className="w-full flex justify-center">
            <h1 className="font-bold text-4xl mb-4">Login</h1>
          </div>
          <div className="w-full">
            <form>
              <span className="font-bold">CNPJ</span>
              <InputText
                type="text"
                className="grow"
                placeholder="Digite seu CNPJ"
                icon={<FaUser />}
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <span className="font-bold">Senha</span>
              <InputText
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

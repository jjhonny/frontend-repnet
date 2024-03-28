import { useState, FormEvent, useContext } from "react";
import { InputText } from "../../components/InputText";
import { FaKey, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { AuthContext } from "../../contexts/AuthContex";

export function Login() {
  const [cnpj, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (cnpj === "") {
      alert("Preencha todos os campos");
      return;
    }

    if (password === "") {
      alert("Preencha todos os campos");
      return;
    }

    let data = {
      cnpj,
      password,
    };

    await signIn(data);
  }

  return (
    <>
      <main className="w-full h-screen flex justify-center items-center flex-col">
        <div className="bg-white w-full max-w-lg p-10 flex flex-col rounded-lg shadow-lg">
          <div className="w-full flex justify-center">
            <h1 className="font-bold text-4xl mb-4">Login</h1>
          </div>
          <div className="w-full">
            <form onSubmit={handleLogin}>
              <span className="font-bold">CNPJ</span>
              <InputText
                type="text"
                name="cnpj"
                className="grow"
                placeholder="Digite seu CNPJ"
                icon={<FaUser />}
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
              <span className="font-bold">Senha</span>
              <InputText
                type="password"
                name="password"
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
                <Link className="link link-hover opacity-90" to="/cadastro">
                  Criar conta
                </Link>
              </div>
              <div className="flex justify-center items-center mt-5">
                <button className="btn btn-neutral w-full" type="submit">
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

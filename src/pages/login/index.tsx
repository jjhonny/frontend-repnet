import { useState, FormEvent } from "react";
import { InputText } from "../../components/InputText";
import { FaKey, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";

export function Login() {
  const [cnpj, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    console.log(cnpj, password);

    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        JSON.stringify({ cnpj, password }),
        {
          headers: { "Content-Type": "application/json" },
        },
      );
      console.log(response.data);
      document.location.href = "/";
    } catch (error) {
      const axiosError = error as AxiosError;

      if (!axiosError?.response) {
        setError("Erro ao acessar o servidor");
      } else if (axiosError.response.status == 401) {
        setError("Usuario ou senha inválidos");
      }

      setTimeout(() => {
        setError("");
      }, 1500);
    }
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
                <button
                  className="btn btn-neutral w-full"
                  type="submit"
                  onClick={handleLogin}
                >
                  Entrar
                </button>
              </div>
            </form>
            <p
              className={`flex justify-center items-center mt-5 font-bold text-lg text-red-500 transition-opacity duration-500 ${error ? "opacity-100" : "opacity-0"}`}
            >
              {error}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

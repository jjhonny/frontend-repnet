import { useState, FormEvent } from "react";
import { InputText } from "../../components/InputText";
import { FaAddressCard, FaEnvelope, FaKey, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

export function Cadastro() {
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
        <div className="bg-white w-full max-w-lg px-10 py-5 flex flex-col rounded-lg shadow-lg">
          <div className="w-full flex justify-center">
            <h1 className="font-bold text-4xl mb-4">Criar Conta</h1>
          </div>
          <div className="w-full">
            <form className="flex flex-col">
              <span className="font-bold">Você é um</span>
              <select className="select select-bordered w-full mt-2 mb-2">
                <option value="R">Representante</option>
                <option value="C">Cliente</option>
              </select>
              <span className="font-bold">Nome da loja</span>
              <InputText
                type="text"
                className="grow"
                placeholder="Digite o nome da sua loja"
                icon={<FaAddressCard />}
              />
              <span className="font-bold">CNPJ</span>
              <InputText
                type="text"
                className="grow"
                placeholder="Digite seu CNPJ"
                icon={<FaUser />}
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <span className="font-bold">Email</span>
              <InputText
                type="text"
                className="grow"
                placeholder="Digite o seu email"
                icon={<FaEnvelope />}
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
              <span className="font-bold">Confirmar senha</span>
              <InputText
                type="text"
                className="grow"
                placeholder="Confirme a sua senha"
                icon={<FaKey />}
              />
              <div className="flex flex-row justify-between pt-3">
                <a className="link link-hover opacity-90">
                  <Link to="/logincliente">Já possui uma conta?</Link>
                </a>
              </div>
              <div className="flex justify-center items-center mt-5">
                <button
                  className="btn btn-neutral w-full"
                  onClick={handleLogin}
                >
                  Criar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

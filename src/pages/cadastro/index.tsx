"use client";
import { useState, FormEvent, useContext } from "react";
import { InputText } from "@/components/input-text";
import { AuthContext } from "@/contexts/AuthContex";
import { FaAddressCard, FaEnvelope, FaKey, FaUser } from "react-icons/fa";
import Link from "next/link";

export default function Cadastro() {
  const { signUp } = useContext(AuthContext);
  const [categoria, SetCategoria] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [password, setPassword] = useState("");
  const [razao_social, Setrazao_social] = useState("");
  const [email, setEmail] = useState("");

  async function handleSignUp(event: FormEvent) {
    event.preventDefault();
    console.log(categoria, cnpj, password, razao_social, email);

    if (categoria === "") {
      alert("Preencha todos os campos");
      return;
    }

    if (cnpj === "") {
      alert("Preencha todos os campos");
      return;
    }

    if (password === "") {
      alert("Preencha todos os campos");
      return;
    }

    if (razao_social === "") {
      alert("Preencha todos os campos");
      return;
    }

    if (email === "") {
      alert("Preencha todos os campos");
      return;
    }

    let data = {
      categoria,
      cnpj,
      password,
      razao_social,
      email,
    };

    await signUp(data);
  }

  return (
    <>
      <main className="w-full h-screen flex justify-center items-center flex-col p-4">
        <div className="bg-white w-full max-w-lg px-10 py-5 flex flex-col rounded-lg shadow-lg">
          <div className="w-full flex justify-center">
            <h1 className="font-bold text-4xl mb-4">Criar Conta</h1>
          </div>
          <div className="w-full">
            <form className="flex flex-col" onSubmit={handleSignUp}>
              <span className="font-bold">Você é um</span>
              <select
                className="select select-bordered w-full mt-2 mb-2"
                value={categoria}
                onChange={(e) => SetCategoria(e.target.value)}
              >
                <option> </option>
                <option value="R">Representante</option>
                <option value="C">Cliente</option>
              </select>
              <span className="font-bold">Razão Social</span>
              <InputText
                type="text"
                className="grow"
                value={razao_social}
                onChange={(e) => Setrazao_social(e.target.value)}
                placeholder="Digite o nome da sua loja"
                icon={<FaAddressCard />}
              />
              <span className="font-bold">CNPJ</span>
              <InputText
                type="text"
                className="grow"
                placeholder="Digite seu CNPJ"
                icon={<FaUser />}
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
              />
              <span className="font-bold">Email</span>
              <InputText
                type="text"
                className="grow"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                <Link className="link link-hover opacity-90" href="/login">
                  Já possui uma conta?
                </Link>
              </div>
              <div className="flex justify-center items-center mt-5">
                <button className="btn btn-neutral w-full" type="submit">
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

import { useState, FormEvent, useContext } from "react";
import { InputText } from "@/components/input-text";
import { FaKey, FaUser } from "react-icons/fa";
import { AuthContext } from "@/contexts/AuthContex";
import Link from "next/link";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { cnpjMask } from "@/utils/cnpjMask";
import { SignInProps } from "@/contexts/AuthContex";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import loginImg from "@/assets/logo.png";
import Image from "next/image";

const schema = z.object({
  cnpj: z.string().min(1, "O cnpj é obrigatório."),
  password: z.string().min(1, "A senha é obrigatória."),
});

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInProps>({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  async function handleLogin(data: SignInProps) {
    setLoading(true);
    await signIn(data);
    setLoading(false);
  }

  return (
    <>
      <main className="bg-purple-300 w-full min-h-screen flex justify-center items-center flex-col">
        <div className="bg-white w-full max-w-lg p-8 flex flex-col rounded-lg shadow-xl m-5">
          <div className="w-full flex justify-center">
            <h1 className="font-bold text-4xl mb-4">Login</h1>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit(handleLogin)}>
              <span className="font-bold">CNPJ</span>
              <InputText
                type="text"
                name="cnpj"
                className="grow"
                placeholder="Digite seu CNPJ"
                icon={<FaUser />}
                register={register}
                error={errors.cnpj?.message}
              />
              <span className="font-bold">Senha</span>
              <InputText
                type="password"
                name="password"
                className="grow"
                placeholder="Digite sua senha"
                icon={<FaKey />}
                register={register}
                error={errors.password?.message}
              />
              <div className="flex flex-row justify-between pt-3">
                <a className="link link-hover opacity-90">
                  Esqueceu sua senha?
                </a>
                <Link className="link link-hover opacity-90" href="/cadastro">
                  Criar conta
                </Link>
              </div>
              <div className="flex justify-center items-center mt-5">
                {loading ? (
                  <button
                    className="btn btn-neutral w-full"
                    type="submit"
                    disabled
                  >
                    <span className="loading loading-spinner loading-md"></span>
                  </button>
                ) : (
                  <button
                    className="btn btn-neutral text-white w-full"
                    type="submit"
                  >
                    Entrar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

/* export const getServerSideProps = canSSRGuest(async (context) => {

  return {
    props: {}
  }
}) */

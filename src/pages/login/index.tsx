import { useState, useContext, useEffect } from "react";
import { InputText } from "@/components/input-text";
import { FaKey, FaUser } from "react-icons/fa";
import { AuthContext } from "@/contexts/AuthContex";
import Link from "next/link";
import { SignInProps } from "@/contexts/AuthContex";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";

const schema = z.object({
  cnpj: z.string().min(1, "O cnpj é obrigatório."),
  password: z.string().min(1, "A senha é obrigatória."),
});

export default function Login() {
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signIn } = useContext(AuthContext);

  // Verifica se o usuário já está logado
  // Verifica se o usuário já está logado
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const localUser = JSON.parse(storedUser);
      if (localUser?.categoria === "C") {
        router.replace("/cliente");
      } else if (localUser?.categoria === "R") {
        router.replace("/representante");
      } else {
        setLoadingAuth(false); // Nenhum redirecionamento necessário
      }
    } else {
      setLoadingAuth(false); // Nenhum usuário armazenado
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInProps>({
    resolver: zodResolver(schema),
  });

  async function handleLogin(data: SignInProps) {
    setLoading(true);
    await signIn(data);
    setLoading(false);
  }

  if (loadingAuth) {
    // Exibe um estado de carregamento enquanto verifica o login
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <>
      <main className="bg-base-200 w-full min-h-screen flex justify-center items-center flex-col p-4">
        <div className="bg-white w-full max-w-lg p-8 flex flex-col rounded-lg shadow-xl m-5">
          <div className="w-full flex justify-center">
            <h1 className="font-bold text-4xl mb-4">Login</h1>
          </div>
          <div className="w-full">
            <form onSubmit={handleSubmit(handleLogin)}>
              <span className="font-bold">CNPJ</span>
              <InputText
                mask="99.999.999/9999-99"
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
                <a className="link link-hover opacity-90"></a>
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
                  <button className="btn btn-primary w-full" type="submit">
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

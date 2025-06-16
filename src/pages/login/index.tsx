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
  }, []);

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
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="w-full max-w-lg">
        {/* Glass effect card */}
        <div className="bg-white/80 backdrop-blur-lg w-full p-8 rounded-2xl shadow-xl border border-white/20">
          {/* Logo or Brand Section */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <FaUser className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo</h1>
            <p className="text-gray-600">Faça login para continuar</p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                CNPJ
              </label>
              <InputText
                mask="99.999.999/9999-99"
                type="text"
                name="cnpj"
                className="grow bg-transparent"
                placeholder="Digite seu CNPJ"
                icon={<FaUser className="text-gray-500" />}
                register={register}
                error={errors.cnpj?.message}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Senha
              </label>
              <InputText
                type="password"
                name="password"
                className="grow bg-transparent"
                placeholder="Digite sua senha"
                icon={<FaKey className="text-gray-500" />}
                register={register}
                error={errors.password?.message}
              />
            </div>

            {/* Additional Options */}
            <div className="flex items-center justify-between pt-2">
             {/*  <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Lembrar-me
                </label>
              </div>
              <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
                Esqueceu a senha?
              </a> */}
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="ml-2">Entrando...</span>
                  </div>
                ) : (
                  "Entrar"
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Não tem uma conta?{" "}
                <Link
                  href="/cadastro"
                  className="text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
                >
                  Criar conta
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Ao fazer login, você concorda com nossos{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Termos de Uso
            </a>{" "}
            e{" "}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">
              Política de Privacidade
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

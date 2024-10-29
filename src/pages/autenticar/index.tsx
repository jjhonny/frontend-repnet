import { AuthContext } from "@/contexts/AuthContex";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { FaCode } from "react-icons/fa6";

// Definindo o schema de validação com Zod
const schema = zod.object({
  code: zod
    .string()
    .min(6, "Código deve ter 6 dígitos")
    .max(6, "Código deve ter 6 dígitos"),
});

type AuthUserLoginFormData = zod.infer<typeof schema>;

export default function Autenticar() {
  const { userTemp, AuthUserLogin } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthUserLoginFormData>({
    resolver: zodResolver(schema),
  });

  async function handleAuthLogin(data: AuthUserLoginFormData) {
    setLoading(true);

    try {
      console.log(userTemp);
      const codeAsNumber = Number(data.code);
      await AuthUserLogin({
        cnpj: userTemp?.cnpjUser,
        categoria: userTemp?.categoria,
        code: codeAsNumber,
      });
    } catch (error) {
      console.error("Erro ao autenticar:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-purple-300">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Autenticação
        </h1>
        <form onSubmit={handleSubmit(handleAuthLogin)}>
          {/* Campo para CNPJ */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CNPJ
            </label>
            <input
              type="text"
              value={userTemp?.cnpjUser || ""}
              className="input input-bordered w-full"
              readOnly
              disabled
            />
          </div>

          {/* Campo para Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={userTemp?.email || ""}
              className="input input-bordered w-full"
              readOnly
              disabled
            />
          </div>

          {/* Campo para código de 6 dígitos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de 6 dígitos
            </label>
            <div className="relative">
              <input
                type="text"
                {...register("code")}
                placeholder="Digite seu código"
                className="input input-bordered w-full pl-10"
                maxLength={6}
              />
              <FaCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            </div>
            {errors.code && (
              <span className="text-red-500 text-sm">
                {errors.code.message}
              </span>
            )}
          </div>

          {/* Botão de autenticar */}
          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
            disabled={loading}
          >
            {loading ? "Autenticando..." : "Autenticar"}
          </button>
        </form>
      </div>
    </div>
  );
}

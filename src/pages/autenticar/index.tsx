import { AuthContext } from "@/contexts/AuthContex";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { FaCode } from "react-icons/fa6";
import toast from "react-hot-toast";

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
      const codeAsNumber = Number(data.code);
      await AuthUserLogin({
        cnpj: userTemp?.cnpjUser,
        categoria: userTemp?.categoria,
        code: codeAsNumber,
      });
    } catch (error) {
      toast.error(error.response.data.errormessage, {
        style: {
          background: "#333",
          color: "#fff",
        },
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-lg w-full p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fadeIn">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <FaCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Autenticação</h1>
            <p className="text-gray-600">Digite o código enviado para seu email</p>
          </div>

          <form onSubmit={handleSubmit(handleAuthLogin)} className="space-y-6">
            {/* CNPJ Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                CNPJ
              </label>
              <input
                type="text"
                value={userTemp?.cnpjUser || ""}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                readOnly
                disabled
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={userTemp?.email || ""}
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700"
                readOnly
                disabled
              />
            </div>

            {/* Code Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Código de 6 dígitos
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("code")}
                  placeholder="Digite seu código"
                  className="w-full px-4 py-2 pl-10 bg-transparent border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors duration-200"
                  maxLength={6}
                />
                <FaCode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              {errors.code && (
                <span className="text-red-500 text-sm mt-1 block">
                  {errors.code.message}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              {loading ? (
                <button
                  className="w-full py-3 px-4 bg-gray-400 text-white font-medium rounded-xl flex items-center justify-center space-x-2"
                  disabled
                >
                  <span>Autenticando</span>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </button>
              ) : (
                <button
                  className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-xl transition-colors duration-200 hover:bg-indigo-700"
                  type="submit"
                >
                  Autenticar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
       {/*  <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Não recebeu o código?{" "}
            <button className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              Reenviar código
            </button>
          </p>
        </div> */}
      </div>
    </main>
  );
}

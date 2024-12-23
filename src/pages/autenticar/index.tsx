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
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Autenticação
        </h1>
        <form onSubmit={handleSubmit(handleAuthLogin)}>
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
          <div className="flex justify-center items-center mt-5">
            {loading ? (
              <button className="btn btn-neutral w-full" type="submit" disabled>
                Autenticando...
                <span className="loading loading-spinner loading-md"></span>
              </button>
            ) : (
              <button className="btn btn-primary w-full" type="submit">
                Autenticar
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

import { Header } from "@/components/header";
import { UserProps } from "@/contexts/AuthContex";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { api } from "@/services/apiCliente";
import {
  FaBuilding,
  FaIdBadge,
  FaEnvelope,
  FaLock,
  FaCheck,
  FaPen,
  FaTimes,
} from "react-icons/fa";

export default function PerfilRepre() {
  const [localUser, setLocalUser] = useState<UserProps | null>(null);
  const [editing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      razao_social: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setLocalUser(user);

      // Define os valores dos campos no formulário quando os dados do usuário são carregados
      setValue("razao_social", user.razao_social);
      setValue("email", user.email);
    }
  }, [setValue]);

  const onSubmit = async (data: any) => {
    try {
      const response = await api.patch("/perfil/atualizar", {
        cnpj: localUser.cnpj,
        razao_social: data.razao_social,
        email: data.email,
        password: data.password,
      });

      // Atualize o localStorage com os dados atualizados do usuário
      const updatedUser = { ...localUser, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLocalUser(updatedUser); // Atualize o estado imediatamente

      toast.success("Informações atualizadas com sucesso!", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      setEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar informações:", error);
      toast.error("Erro ao atualizar informações. Tente novamente mais tarde.");
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      if (updatedUser) {
        setLocalUser(JSON.parse(updatedUser));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <div className="max-w-lg hero bg-base-100 rounded-box mb-4 shadow-md mx-auto">
          <div className="hero-content text-center py-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">
                Perfil do{" "}
                {localUser?.categoria === "C" ? "Cliente" : "Representante"}
              </h1>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-2xl rounded-lg max-w-5xl mx-auto p-6 px-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Razão Social
                </label>
                <div className="relative w-full">
                  <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className={`input input-bordered w-full pl-10 p-3 border rounded focus:outline-none focus:ring focus:border-blue-500 ${
                      editing ? "bg-white" : "bg-gray-100"
                    }`}
                    {...register("razao_social", { required: true })}
                    readOnly={!editing}
                  />
                </div>
                {errors.razao_social && (
                  <span className="text-red-500 text-sm">
                    Este campo é obrigatório
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">CNPJ</label>
                <div className="relative w-full">
                  <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 p-3 border rounded focus:outline-none focus:ring focus:border-blue-500 bg-gray-100"
                    value={localUser?.cnpj}
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">Email</label>
                <div className="relative w-full">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    className={`input input-bordered w-full pl-10 p-3 border rounded focus:outline-none focus:ring focus:border-blue-500 ${
                      editing ? "bg-white" : "bg-gray-100"
                    }`}
                    {...register("email", { required: true })}
                    readOnly={!editing}
                  />
                </div>
                {errors.email && (
                  <span className="text-red-500 text-sm">
                    Este campo é obrigatório
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Categoria
                </label>
                <div className="relative w-full">
                  <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10 p-3 border rounded focus:outline-none focus:ring focus:border-blue-500 bg-gray-100"
                    value={
                      localUser?.categoria === "C" ? "Cliente" : "Representante"
                    }
                    readOnly
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Nova Senha
                </label>
                <div className="relative w-full">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                  <input
                    type="password"
                    className={`input input-bordered w-full pl-10 p-3 border rounded focus:outline-none focus:ring focus:border-blue-500 ${
                      editing ? "bg-white" : "bg-gray-100"
                    }`}
                    {...register("password")}
                    readOnly={!editing}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              {!editing ? (
                <button
                  className="btn btn-accent gap-2 hover:scale-105 transition-transform"
                  onClick={handleEditClick}
                >
                  <FaPen /> Editar
                </button>
              ) : (
                <div>
                  <button
                    className="btn btn-success gap-2 mr-2 hover:scale-105 transition-transform"
                    type="submit"
                  >
                    <FaCheck /> Salvar
                  </button>
                  <button
                    className="btn btn-error gap-2 hover:scale-105 transition-transform"
                    onClick={() => setEditing(false)}
                  >
                    <FaTimes /> Cancelar
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});

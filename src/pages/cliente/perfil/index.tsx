import { Header } from "@/components/header";
import { AuthContext } from "@/contexts/AuthContex";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaPen, FaTimes } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { api } from "@/services/apiCliente";

export default function PerfilRepre() {
  const { user } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      razao_social: user.razao_social,
      email: user.email,
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await api.patch("/perfil/atualizar", {
        cnpj: user.cnpj,
        razao_social: data.razao_social,
        email: data.email,
        password: data.password,
      });
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

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Perfil do {user.categoria === "C" ? "Cliente" : "Representante"}
        </h1>
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Razão Social
                </label>
                <input
                  type="text"
                  className={`input input-bordered p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                  {...register("razao_social", { required: true })}
                  readOnly={!editing}
                />
                {errors.razao_social && (
                  <span className="text-red-500 text-sm">
                    Este campo é obrigatório
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">CNPJ</label>
                <input
                  type="text"
                  className="input input-bordered p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-100"
                  value={user.cnpj}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  className={`input input-bordered p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                  {...register("email", { required: true })}
                  readOnly={!editing}
                />
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
                <input
                  type="text"
                  className="input input-bordered p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 bg-gray-100"
                  value={user.categoria === "C" ? "Cliente" : "Representante"}
                  readOnly
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-2 font-medium text-gray-700">
                  Nova Senha
                </label>
                <input
                  type="password"
                  className={`input input-bordered p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 ${
                    editing ? "bg-white" : "bg-gray-100"
                  }`}
                  {...register("password")}
                  readOnly={!editing}
                />
              </div>
            </div>
            <div className="mt-4">
              {!editing ? (
                <button
                  className="btn btn-primary rounded-2xl"
                  onClick={handleEditClick}
                >
                  <FaPen /> Editar
                </button>
              ) : (
                <div>
                  <button
                    className="btn btn-primary rounded-2xl mr-2"
                    type="submit"
                  >
                    <FaCheck /> Salvar
                  </button>
                  <button
                    className="btn btn-secondary rounded-2xl"
                    onClick={() => setEditing(false)}
                  >
                    <FaTimes /> Cancelar
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});

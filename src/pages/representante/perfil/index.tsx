import { useEffect, useState } from "react";
import { useReport } from "@/hooks/useReport";
import { Header } from "@/components/header";
import { UserProps } from "@/contexts/AuthContex";
import { canSSRAuth } from "@/utils/canSSRAuth";
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
  FaUser,
} from "react-icons/fa";
import { FaDownload, FaPrint } from "react-icons/fa6";

export default function PerfilRepre() {
  const {
    loadingDownload,
    loadingEmail,
    handleDownloadReport,
    handleGenerateReport,
  } = useReport();
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

      setValue("razao_social", user.razao_social);
      setValue("email", user.email);
    }
  }, [setValue]);

  const onSubmit = async (data: any) => {
    try {
      await api.patch("/perfil/atualizar", {
        cnpj: localUser?.cnpj,
        razao_social: data.razao_social,
        email: data.email,
        password: data.password,
      });

      const updatedUser = { ...localUser, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setLocalUser(updatedUser);

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

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
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
      <main className="flex-grow container mx-auto p-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Cabeçalho do perfil */}
          <div className="bg-base-100 rounded-t-xl shadow-md p-6">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-primary text-white rounded-full w-16 h-16 ring ring-primary ring-offset-2 ring-offset-base-100">
                  <span className="text-2xl">
                    {localUser?.razao_social?.charAt(0) || <FaUser />}
                  </span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {localUser?.razao_social || "Carregando..."}
                </h1>
                <p className="text-gray-600 flex items-center gap-1">
                  <FaIdBadge className="text-primary" />
                  {localUser?.categoria === "C" ? "Cliente" : "Representante"}
                </p>
              </div>
            </div>
          </div>

          {/* Corpo do formulário */}
          <div className="bg-white shadow-xl rounded-b-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Informações do Usuário
              </h2>
              {editing && (
                <div className="badge badge-warning gap-1">
                  <FaPen size={12} /> Modo Edição
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="divider my-2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Razão Social</span>
                  </label>
                  <div className="relative">
                    <FaBuilding className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      className={`input input-bordered w-full pl-10 focus:ring-2 ${
                        editing 
                          ? "bg-white focus:ring-primary" 
                          : "bg-gray-100 cursor-not-allowed"
                      } ${errors.razao_social ? "input-error" : ""}`}
                      {...register("razao_social", { 
                        required: "Razão social é obrigatória" 
                      })}
                      readOnly={!editing}
                    />
                  </div>
                  {errors.razao_social && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.razao_social.message as string}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">CNPJ</span>
                  </label>
                  <div className="relative">
                    <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10 bg-gray-100 cursor-not-allowed"
                      value={localUser?.cnpj || ""}
                      readOnly
                    />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="email"
                      className={`input input-bordered w-full pl-10 focus:ring-2 ${
                        editing 
                          ? "bg-white focus:ring-primary" 
                          : "bg-gray-100 cursor-not-allowed"
                      } ${errors.email ? "input-error" : ""}`}
                      {...register("email", { 
                        required: "Email é obrigatório",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Email inválido"
                        }
                      })}
                      readOnly={!editing}
                    />
                  </div>
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">
                        {errors.email.message as string}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Categoria</span>
                  </label>
                  <div className="relative">
                    <FaIdBadge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10 bg-gray-100 cursor-not-allowed"
                      value={
                        localUser?.categoria === "C" ? "Cliente" : "Representante"
                      }
                      readOnly
                    />
                  </div>
                </div>

                {editing && (
                  <div className="form-control w-full md:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Nova Senha</span>
                      <span className="label-text-alt text-gray-500">Opcional</span>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        type="password"
                        className="input input-bordered w-full pl-10 focus:ring-2 focus:ring-primary"
                        {...register("password")}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mt-6 justify-between">
                <div className="flex flex-wrap gap-2">
                  {!editing ? (
                    <button
                      className="btn btn-primary gap-2 hover:scale-105 transition-transform"
                      onClick={handleEditClick}
                    >
                      <FaPen size={14} /> Editar Perfil
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        className="btn btn-success gap-2 hover:scale-105 transition-transform"
                        type="submit"
                      >
                        <FaCheck /> Salvar Alterações
                      </button>
                      <button
                        className="btn btn-error gap-2 hover:scale-105 transition-transform"
                        type="button"
                        onClick={() => setEditing(false)}
                      >
                        <FaTimes /> Cancelar
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    className="btn btn-primary gap-2 hover:scale-105 transition-transform"
                    type="button"
                    onClick={() => handleGenerateReport(localUser)}
                    disabled={loadingEmail}
                  >
                    <FaPrint /> Relatório Email
                    {loadingEmail && (
                      <span className="loading loading-spinner loading-sm"></span>
                    )}
                  </button>
                  <button
                    className="btn btn-primary gap-2 hover:scale-105 transition-transform"
                    type="button"
                    onClick={() => handleDownloadReport(localUser)}
                    disabled={loadingDownload}
                  >
                    <FaDownload /> Baixar Relatório
                    {loadingDownload && (
                      <span className="loading loading-spinner loading-sm"></span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
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

import { InputText } from "@/components/input-text";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { FaTag } from "react-icons/fa";

type CategoryProps = {
  descricao: string;
};

const schema = z.object({
  descricao: z.string().min(1, "O campo é obrigatório."),
});

export default function NovaCategoria() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryProps>({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);

  async function handleRegisterCategory(data: CategoryProps) {
    const dataCategoryFormated = {
      descricao: data.descricao,
    };

    try {
      setLoading(true);
      const response = await api.post(
        "/cadastro-categoria",
        dataCategoryFormated
      );
      toast.success("Categoria cadastrada com sucesso!", {
        style: {
          background: "#333",
          color: "#fff",
        },
        position: "top-right",
      });
      reset();
    } catch (error) {
      const errorMessage = error.response?.data?.errormessage || "Erro ao cadastrar categoria.";
      toast.error(errorMessage, {
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
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="container mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-2">
            <FaTag className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Cadastrar Nova Categoria
          </h1>
          <p className="text-gray-600 text-sm">
            Adicione uma nova categoria ao seu sistema
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-focus p-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaTag className="w-5 h-5" />
                Informações da Categoria
              </h2>
            </div>

            <form onSubmit={handleSubmit(handleRegisterCategory)} className="p-6">
              <div className="mb-6">
                <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                  <FaTag className="w-4 h-4 text-primary" />
                  Nome da categoria<span className="text-error">*</span>
                </label>
                <InputText
                  type="text"
                  name="descricao"
                  className="w-full"
                  placeholder="Digite o nome da categoria"
                  register={register}
                  error={errors.descricao?.message}
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4 mt-4 border-t border-gray-200">
                {loading ? (
                  <button
                    className="btn btn-primary px-8"
                    type="submit"
                    disabled
                  >
                    <span className="loading loading-spinner loading-sm"></span>
                    Cadastrando...
                  </button>
                ) : (
                  <button className="btn btn-primary px-8 gap-2" type="submit">
                    <FaTag className="w-4 h-4" />
                    Cadastrar Categoria
                  </button>
                )}
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

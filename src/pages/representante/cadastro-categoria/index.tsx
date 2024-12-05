import { InputText } from "@/components/inputText";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";

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
      });
      reset();
    } catch (error) {
      toast.error("Erro ao cadastrar categoria.");
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
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />
      <main className="max-w-6xl flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md hero bg-base-100 rounded-box mb-6 shadow-md mx-auto">
          <div className="hero-content text-center py-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">
                Cadastrar nova Categoria
              </h1>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-lg px-8 py-6 space-y-4">
          <form onSubmit={handleSubmit(handleRegisterCategory)}>
            <div className="mb-4">
              <span className="font-bold">
                Categoria<span className="text-red-500">*</span>
              </span>
              <InputText
                type="text"
                name="descricao"
                className="grow"
                placeholder="Digite a categoria que você quer cadastrar"
                register={register}
                error={errors.descricao?.message}
              />
            </div>
            <div className="flex justify-end">
              {loading ? (
                <button
                  className="btn btn-neutral w-full"
                  type="submit"
                  disabled
                >
                  <span className="loading loading-spinner loading-md"></span>
                </button>
              ) : (
                <button className="btn btn-primary w-full gap-2" type="submit">
                  Registrar Categoria
                </button>
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

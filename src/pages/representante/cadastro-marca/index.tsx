import { InputText } from "@/components/input-text";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";

type BrandProps = {
  cnpj_rep: string;
  cnpj_marca: string;
  razao_social: string;
};

const schema = z.object({
  cnpj_rep: z.string().min(1, "O campo é obrigatório."),
  cnpj_marca: z.string().min(1, "O campo é obrigatório."),
  razao_social: z.string().min(1, "O campo é obrigatório."),
});

export default function NovaMarca() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BrandProps>({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);

  async function handleRegisterBrand(data: BrandProps) {
    console.log(data);

    try {
      setLoading(true);
      const response = await api.post("/cadastro-marca", data);
      toast.success("Marca cadastrada com sucesso!", {
        style: {
          background: "#333",
          color: "#fff",
        },
        position: "top-right",
      });
      reset(); // Reseta todos os campos do formulário
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar marca.", {
        position: "top-right",
      });
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
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md hero bg-base-100 rounded-box mb-6 shadow-md mx-auto">
          <div className="hero-content text-center py-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">
                Cadastrar nova Marca
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 space-y-4">
          <form onSubmit={handleSubmit(handleRegisterBrand)}>
            <div className="mb-4">
              <div>
                <span className="font-bold">
                  CNPJ Representante<span className="text-red-500">*</span>
                </span>
                <InputText
                  mask="99.999.999/9999-99"
                  type="text"
                  name="cnpj_rep"
                  className="grow"
                  placeholder="Digite o CNPJ do representante"
                  register={register}
                  error={errors.cnpj_rep?.message}
                />
              </div>
            </div>
            <div className="mb-4">
              <div>
                <span className="font-bold">
                  Razão Social<span className="text-red-500">*</span>
                </span>
                <InputText
                  type="text"
                  name="cnpj_marca"
                  className="grow"
                  placeholder="Digite a razão social da marca"
                  register={register}
                  error={errors.cnpj_marca?.message}
                />
              </div>
            </div>
            <div className="mb-4">
              <div>
                <span className="font-bold">
                  Nome da Marca<span className="text-red-500">*</span>
                </span>
                <InputText
                  type="text"
                  name="razao_social"
                  className="grow"
                  placeholder="Digite o nome da marca que quer cadastrar."
                  register={register}
                  error={errors.razao_social?.message}
                />
              </div>
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
                  Registrar Marca
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

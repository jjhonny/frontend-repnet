import { InputText } from "@/components/input-text";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { FaBuilding, FaIdCard, FaSignature } from "react-icons/fa";

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
      reset();
    } catch (error) {
      const errorMessage = error.response?.data?.errormessage || "Erro ao cadastrar marca.";
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
            <FaBuilding className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Cadastrar Nova Marca
          </h1>
          <p className="text-gray-600 text-sm">
            Adicione uma nova marca ao seu sistema
          </p>
        </div>

        {/* Form Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-primary-focus p-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FaBuilding className="w-5 h-5" />
                Informações da Marca
              </h2>
            </div>

            <form onSubmit={handleSubmit(handleRegisterBrand)} className="p-6">
              <div className="grid grid-cols-1 gap-6">
                {/* CNPJ Representante */}
                <div>
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                    <FaIdCard className="w-4 h-4 text-primary" />
                    CNPJ do Representante<span className="text-error">*</span>
                  </label>
                  <InputText
                    mask="99.999.999/9999-99"
                    type="text"
                    name="cnpj_rep"
                    className="w-full"
                    placeholder="Digite o CNPJ do representante"
                    register={register}
                    error={errors.cnpj_rep?.message}
                  />
                </div>

                {/* Razão Social */}
                <div>
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                    <FaBuilding className="w-4 h-4 text-primary" />
                    Razão Social<span className="text-error">*</span>
                  </label>
                  <InputText
                    type="text"
                    name="cnpj_marca"
                    className="w-full"
                    placeholder="Digite a razão social da marca"
                    register={register}
                    error={errors.cnpj_marca?.message}
                  />
                </div>

                {/* Nome da Marca */}
                <div>
                  <label className="flex items-center gap-2 text-base font-semibold text-gray-900 mb-2">
                    <FaSignature className="w-4 h-4 text-primary" />
                    Nome da Marca<span className="text-error">*</span>
                  </label>
                  <InputText
                    type="text"
                    name="razao_social"
                    className="w-full"
                    placeholder="Digite o nome da marca"
                    register={register}
                    error={errors.razao_social?.message}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4 mt-6 border-t border-gray-200">
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
                    <FaBuilding className="w-4 h-4" />
                    Cadastrar Marca
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

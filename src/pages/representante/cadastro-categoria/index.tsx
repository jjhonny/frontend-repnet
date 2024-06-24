import { InputText } from "@/components/input-text";
import { AuthContext } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { FormEvent, useContext, useState } from "react";
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
  const { signOut, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  async function handleRegisterCategory(data: CategoryProps) {
    console.log(data);

    const dataCategoryFormated = {
      descricao: data.descricao,
    };

    try {
      setLoading(true);
      const response = await api.post("/cadastro-categoria", dataCategoryFormated);
      toast.success("Categoria cadastrada com sucesso!");
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar categoria.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Cadastrar nova Categoria
        </h1>
        <div className="bg-white rounded-lg shadow-lg px-8 py-6 space-y-4">
          <form onSubmit={handleSubmit(handleRegisterCategory)}>
            <div className="mb-4">
              <div>
                <span className="font-bold">Categoria</span>
                <InputText
                  type="text"
                  name="descricao"
                  className="grow"
                  placeholder="Digite a categoria que você quer cadastrar"
                  register={register}
                  error={errors.descricao?.message}
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
                <button className="btn btn-primary w-full" type="submit">
                  Registrar Categoria
                </button>
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

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

type ProductsProps = {
  descricao: string;
  validade: string;
  peso: number;
  preco: number;
  categoria: string;
  marca: string;
};

const schema = z.object({
  descricao: z.string().min(1, "O campo é obrigatório."),
  validade: z.string().min(1, "O campo é obrigatório."),
  peso: z.string().min(1, "O campo é obrigatório."),
  preco: z.string().min(1, "O campo é obrigatório."),
  categoria: z.string().min(1, "O campo é obrigatório."),
  marca: z.string().min(1, "O campo é obrigatório."),
});

export default function NovoProduto() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductsProps>({
    resolver: zodResolver(schema),
  });
  const { signOut, user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  async function handleRegisterProduct(dataProduct: ProductsProps) {
    console.log(dataProduct);

    const { categoria, marca, descricao, validade } = dataProduct;
    let { peso, preco } = dataProduct;
    peso = Number(peso);
    preco = Number(preco);

    const dataProductFormated = {
      categoria: categoria,
      marca: marca,
      descricao: descricao,
      peso: peso,
      preco: preco,
      validade: validade,
    };

    try {
      setLoading(true);
      const response = await api.post("/cadastro-produto", dataProductFormated);
      toast.success("Produto cadastrado com sucesso!");
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Cadastrar novo produto
        </h1>
        <div className="bg-white rounded-lg shadow-lg px-8 py-6 space-y-4">
          <form onSubmit={handleSubmit(handleRegisterProduct)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold">Nome do produto</span>
                <InputText
                  type="text"
                  name="descricao"
                  className="grow"
                  placeholder="Digite o nome do produto"
                  register={register}
                  error={errors.descricao?.message}
                />
              </div>
              <div className="mb-4">
                <span className="font-bold">Validade do produto</span>
                <InputText
                  type="date"
                  name="validade"
                  className="grow"
                  placeholder="Digite a data de validade"
                  register={register}
                  error={errors.validade?.message}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold">Peso do Produto</span>
                <InputText
                  type="number"
                  name="peso"
                  className="grow"
                  placeholder="Digite o peso do produto"
                  register={register}
                  error={errors.peso?.message}
                />
              </div>
              <div className="mb-4">
                <span className="font-bold">Preço do produto</span>
                <InputText
                  type="number"
                  name="preco"
                  className="grow"
                  placeholder="Digite o preço do produto"
                  register={register}
                  error={errors.preco?.message}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold">Categoria do produto</span>
                <InputText
                  type="text"
                  name="categoria"
                  className="grow"
                  placeholder="Digite a categoria do produto"
                  register={register}
                  error={errors.categoria?.message}
                />
              </div>
              <div className="mb-4">
                <span className="font-bold">Marca do produto</span>
                <InputText
                  type="text"
                  name="marca"
                  className="grow"
                  placeholder="Digite a marca do produto"
                  register={register}
                  error={errors.marca?.message}
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
                  Cadastrar Produto
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

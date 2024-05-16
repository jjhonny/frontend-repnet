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
      const response = await api.post(
        "/representante/cadastro-produto",
        dataProductFormated
      );
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
      <header className="w-full h-16 bg-white flex justify-between items-center px-3 shadow-md">
        <div>Logo</div>
        <div className="flex gap-4">
          <Link
            className="btn btn-sm btn-neutral"
            href={user.categoria === "C" ? "/cliente" : "/representante"}
          >
            Home
          </Link>
          <button className="btn btn-sm btn-neutral" onClick={() => signOut()}>
            Deslogar
          </button>
        </div>
      </header>
      <main className="flex justify-center min-h-screen items-center p-4">
        <div className="bg-white w-full max-w-3xl px-10 py-5 flex flex-col rounded-lg shadow-lg mt-2">
          <div className="w-full flex justify-center">
            <h1 className="font-bold text-4xl mb-4">Cadastrar novo produto</h1>
          </div>
          <div className="w-full">
            <form
              className="flex flex-col"
              onSubmit={handleSubmit(handleRegisterProduct)}
            >
              <span className="font-bold">Nome do produto</span>
              <InputText
                type="text"
                name="descricao"
                className="grow"
                placeholder="Digite o nome do produto"
                register={register}
                error={errors.descricao?.message}
              />
              <span className="font-bold">Validade do produto</span>
              <InputText
                type="date"
                name="validade"
                className="grow"
                placeholder="Digite a data de validade"
                register={register}
                error={errors.validade?.message}
              />
              <span className="font-bold">Peso do Produto</span>
              <InputText
                type="number"
                name="peso"
                className="grow"
                placeholder="Digite o peso do produto"
                register={register}
                error={errors.peso?.message}
              />
              <span className="font-bold">Preço do produto</span>
              <InputText
                type="number"
                name="preco"
                className="grow"
                placeholder="Digite o preço do produto"
                register={register}
                error={errors.preco?.message}
              />
              <span className="font-bold">Categoria do produto</span>
              <InputText
                type="text"
                name="categoria"
                className="grow"
                placeholder="Digite o preço do produto"
                register={register}
                error={errors.categoria?.message}
              />
              <span className="font-bold">Marca do produto</span>
              <InputText
                type="text"
                name="marca"
                className="grow"
                placeholder="Digite a marca do produto"
                register={register}
                error={errors.marca?.message}
              />
              <div className="flex justify-center items-center mt-5">
                {loading ? (
                  <button
                    className="btn btn-neutral w-full"
                    type="submit"
                    disabled
                  >
                    <span className="loading loading-spinner loading-md"></span>
                  </button>
                ) : (
                  <button className="btn btn-neutral w-full" type="submit">
                    Cadastrar Produto
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});

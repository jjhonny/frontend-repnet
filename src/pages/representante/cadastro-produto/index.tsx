import { InputText } from "@/components/input-text";
import { AuthContext } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { FormEvent, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/header";
import { Select } from "@/components/select";
import Footer from "@/components/Footer";

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
  validade: z.string(),
  peso: z.string(),
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
  const [categoryOptions, setCategoryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [brandOptions, setBrandOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await api.get("/categorias");
        const categories = response.data.map((category: any) => ({
          value: category.razao_social,
          label: category.nome,
        }));
        setCategoryOptions(categories);
      } catch (error) {
        console.error("Erro ao buscar categorias", error);
        toast.error("Erro ao buscar categorias.");
      }
    }

    async function fetchBrands() {
      try {
        const response = await api.get("/marcas");
        const brands = response.data.map((brand: any) => ({
          value: brand.id,
          label: brand.razao_social,
        }));
        setBrandOptions(brands);
      } catch (error) {
        console.error("Erro ao buscar marcas", error);
        toast.error("Erro ao buscar marcas.");
      }
    }

    fetchCategories();
    fetchBrands();
  }, []);

  async function handleRegisterProduct(dataProduct: ProductsProps) {
    console.log(dataProduct);

    const { categoria, marca, descricao, validade } = dataProduct;
    let { peso, preco } = dataProduct;
    peso = Number(peso);
    preco = Number(preco);
    console.log(categoria);
    const dataProductFormated = {
      categoria: categoria,
      marca: marca,
      descricao: descricao,
      peso: peso,
      preco: preco,
      validade: validade,
    };

    console.log(dataProductFormated);

    try {
      setLoading(true);
      const response = await api.post("/cadastro-produto", dataProductFormated);
      toast.success("Produto cadastrado com sucesso!", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      reset();
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar produto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow max-w-6xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Cadastrar novo produto
        </h1>
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 space-y-4">
          <form onSubmit={handleSubmit(handleRegisterProduct)}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold">
                  Nome do produto<span className="text-red-500">*</span>
                </span>
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
                  placeholder="Digite a data de validade (opcional)"
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
                <span className="font-bold">
                  Preço do produto<span className="text-red-500">*</span>
                </span>
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
                <span className="font-bold">
                  Categoria do produto<span className="text-red-500">*</span>
                </span>
                <Select
                  name="categoria"
                  className="select select-bordered w-full mt-2"
                  register={register}
                  options={categoryOptions}
                  placeholder="Selecione uma categoria"
                  rules={{ required: "Por favor, selecione uma categoria" }}
                  error={errors.categoria?.message}
                />
              </div>
              <div className="mb-4">
                <span className="font-bold">
                  Marca<span className="text-red-500">*</span>
                </span>
                <Select
                  name="marca"
                  className="select select-bordered w-full mt-2"
                  register={register}
                  options={brandOptions}
                  placeholder="Selecione uma marca"
                  rules={{ required: "Por favor, selecione uma marca" }}
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
                <button
                  className="btn btn-primary w-full rounded-2xl"
                  type="submit"
                >
                  Cadastrar Produto
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});

import { InputText } from "@/components/InputText";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Header } from "@/components/Header";
import { Select } from "@/components/Select";

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
      toast.error("Erro ao cadastrar produto.");
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
      <main className="w-11/12 flex-grow mx-auto px-8 py-8">
        <div className="max-w-md hero bg-base-100 rounded-box mb-6 shadow-md mx-auto">
          <div className="hero-content text-center py-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">
                Cadastrar novo produto
              </h1>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 space-y-6">
          <form
            onSubmit={handleSubmit(handleRegisterProduct)}
            className="space-y-6"
          >
            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="descricao"
                  className="block font-bold text-sm sm:text-base"
                >
                  Nome do produto<span className="text-red-500">*</span>
                </label>
                <InputText
                  type="text"
                  name="descricao"
                  className="w-full"
                  placeholder="Digite o nome do produto"
                  register={register}
                  error={errors.descricao?.message}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="validade"
                  className="block font-bold text-sm sm:text-base"
                >
                  Validade do produto
                </label>
                <InputText
                  type="date"
                  name="validade"
                  className="w-full"
                  placeholder="Digite a data de validade (opcional)"
                  register={register}
                  error={errors.validade?.message}
                />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="peso"
                  className="block font-bold text-sm sm:text-base"
                >
                  Peso do Produto
                </label>
                <InputText
                  type="number"
                  name="peso"
                  className="w-full"
                  placeholder="Digite o peso do produto"
                  register={register}
                  error={errors.peso?.message}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="preco"
                  className="block font-bold text-sm sm:text-base"
                >
                  Preço do produto<span className="text-red-500">*</span>
                </label>
                <InputText
                  type="number"
                  name="preco"
                  className="w-full"
                  placeholder="Digite o preço do produto"
                  register={register}
                  error={errors.preco?.message}
                />
              </div>
            </div>

            <div className="space-y-6 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="categoria"
                  className="block font-bold text-sm sm:text-base"
                >
                  Categoria do produto<span className="text-red-500">*</span>
                </label>
                <Select
                  name="categoria"
                  className="select select-bordered w-full"
                  register={register}
                  options={categoryOptions}
                  placeholder="Selecione uma categoria"
                  rules={{ required: "Por favor, selecione uma categoria" }}
                  error={errors.categoria?.message}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="marca"
                  className="block font-bold text-sm sm:text-base"
                >
                  Marca<span className="text-red-500">*</span>
                </label>
                <Select
                  name="marca"
                  className="select select-bordered w-full"
                  register={register}
                  options={brandOptions}
                  placeholder="Selecione uma marca"
                  rules={{ required: "Por favor, selecione uma marca" }}
                  error={errors.marca?.message}
                />
              </div>
            </div>

            <div className="pt-4">
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
                  Cadastrar Produto
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

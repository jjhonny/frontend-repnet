import { Header } from "@/components/header";
import { UserProps } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import toast, { Toaster } from "react-hot-toast";

export interface ProductsProps {
  id: number;
  descricao: string;
  validade: string;
  peso: number;
  preco: number;
  id_cat: number;
  id_marca: number;
}

export default function Produtos() {
  const [localUser, setLocalUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  const { addItemCart, cart } = useCart();
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function handleSearchProduct() {
      setLoading(true);
      try {
        const response = await api.get("/produtos");
        const produtosBack = response.data;
        if (produtosBack.length >= 1) {
          setProducts(produtosBack);
        }
      } catch (error) {
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

    handleSearchProduct();
  }, []);

  // Função para adicionar item ao carrinho e exibir toast
  const handleAddToCart = (item: ProductsProps) => {
    addItemCart(item);
    toast.success(`${item.descricao} adicionado ao carrinho com sucesso!`, {
      duration: 1500,
      position: "top-center",
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    if (!dateString) return "Sem data";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Toaster />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-8">Produtos</h1>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="w-full flex flex-wrap justify-center max-w-7xl mx-auto px-4 mt-6 gap-6">
              {products.length >= 1 ? (
                products.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-2xl overflow-hidden w-60 hover:scale-105 transition-all"
                  >
                    <figure>
                      <img
                        src="https://cdn.sanity.io/images/tlr8oxjg/production/7b7f05720074a848850e0705779306c27da5a6cf-1065x597.png?w=3840&q=80&fit=clip&auto=format"
                        alt="Produto"
                        className="w-full h-32 object-cover"
                      />
                    </figure>
                    <div className="card-body p-4">
                      <h2 className="card-title text-lg">{item.descricao}</h2>
                      <p className="text-sm text-gray-500">
                        Validade: {formatDate(item.validade)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Categoria: {item.id_cat}
                      </p>
                      <p className="text-sm text-gray-500">
                        Marca: {item.id_marca}
                      </p>
                      <div className="card-actions justify-between mt-2">
                        <p className="text-md font-bold text-gray-700">
                          R${" "}
                          {Intl.NumberFormat("pt-BR", {
                            currency: "BRL",
                            minimumFractionDigits: 2,
                          }).format(Number(item.preco))}
                        </p>
                        {localUser?.categoria === "C" && (
                          <button
                            className="btn btn-primary btn-sm rounded-lg"
                            onClick={() => handleAddToCart(item)}
                          >
                            Comprar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-2xl">
                  Sem produtos cadastrados
                </div>
              )}
            </div>
          )}
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

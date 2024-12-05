import { Header } from "@/components/header";
import { UserProps } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { formatCurrency } from "@/utils/formatCurrency";
import { SearchInput } from "@/components/search-input";

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
  const { addItemCart, cart } = useCart();
  const [localUser, setLocalUser] = useState<UserProps | null>(null);
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    async function handleSearchProduct() {
      setLoading(true);
      try {
        const response = await api.get("/produtos");
        const produtosBack = response.data;
        if (Array.isArray(produtosBack) && produtosBack.length > 0) {
          setProducts(produtosBack);
        } else {
          setProducts([]);
          toast.error("Nenhum produto encontrado.", {
            style: {
              background: "#333",
              color: "#fff",
            },
          });
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.errormessage || "Erro ao buscar os produtos.";
        toast.error(errorMessage, {
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

  const filteredProducts = products.filter((item) =>
    item.descricao.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen flex flex-col bg-base-200">
        <Header />
        <Toaster />
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md hero bg-base-100 rounded-box mb-12 shadow-md mx-auto">
            <div className="hero-content text-center py-6">
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 text-center tracking-tight">
                  Produtos
                </h1>
              </div>
            </div>
          </div>
          <SearchInput value={searchItem} onChange={setSearchItem} />
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto px-4">
              {filteredProducts.length >= 1 ? (
                filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                  >
                    <div className="relative">
                      <img
                        src="https://cdn.sanity.io/images/tlr8oxjg/production/7b7f05720074a848850e0705779306c27da5a6cf-1065x597.png?w=3840&q=80&fit=clip&auto=format"
                        alt="Produto"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    <div className="p-6 space-y-4">
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-2">
                        {item.descricao}
                      </h2>

                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="text-sm">
                            Validade: {formatDate(item.validade)}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          <span className="text-sm">
                            Categoria: {item.id_cat}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span className="text-sm">
                            Marca: {item.id_marca}
                          </span>
                        </div>
                      </div>

                      <div className="card-actions pt-4 flex items-center justify-between border-t border-gray-200">
                        <p className="text-xl font-bold text-gray-700">
                          R$ {formatCurrency(item.preco)}
                        </p>
                        {localUser?.categoria === "C" && (
                          <button
                            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                <div className="col-span-full text-center py-12">
                  <p className="text-2xl font-medium text-gray-600">
                    Sem produtos cadastrados
                  </p>
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

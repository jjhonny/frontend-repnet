import { Header } from "@/components/header";
import { UserProps } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useEffect, useState } from "react";
import { useCart } from "@/contexts/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { formatCurrency } from "@/utils/formatCurrency";
import { SearchInput } from "@/components/search-input";
import { formatDate } from "@/utils/formatDate";
import { FaShoppingBasket } from 'react-icons/fa';

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
  const { addItemCart, cart, updateItemQuantity } = useCart();
  const [localUser, setLocalUser] = useState<UserProps | null>(null);
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchItem, setSearchItem] = useState("");
  const [quantities, setQuantities] = useState<{ [productId: number]: string }>({});

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

  const handleQuantityChange = (productId: number, value: string) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleAddToCart = (item: ProductsProps) => {
    let rawValue = quantities[item.id];
    let quantity = parseInt(rawValue, 10);
    if (isNaN(quantity) || quantity < 1) quantity = 1;
    addItemCart(item, quantity);
    toast.success(`${quantity}x ${item.descricao} adicionados ao carrinho com sucesso!`, {
      duration: 1500,
      position: "top-right",
      style: {
        background: "#333",
        color: "#fff",
      },
    });
    setQuantities((prev) => ({ ...prev, [item.id]: "1" }));
  };

  const filteredProducts = products.filter((item) =>
    item.descricao.toLowerCase().includes(searchItem.toLowerCase())
  );

  return (
    <>
      <div className="min-h-screen flex flex-col bg-base-200">
        <Header />
        <Toaster />
        
        <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-base-100 shadow-md rounded-xl mb-8 p-6 border border-gray-200">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Produtos
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Explore nossa variedade de produtos disponíveis
                  </p>
                </div>
                <div className="hidden sm:block">
                  <FaShoppingBasket className="w-14 h-14 text-blue-500/30" />
                </div>
              </div>
              <div>
                <SearchInput value={searchItem} onChange={setSearchItem} />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20 bg-base-100 rounded-xl shadow-sm border border-gray-200">
              <span className="loading loading-spinner loading-lg text-primary"></span>
              <p className="mt-4 text-gray-600">Carregando produtos...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.length >= 1 ? (
                filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-md overflow-hidden h-full flex flex-col border border-gray-200"
                  >
                    <div className="relative">
                      <img
                        src="https://cdn.sanity.io/images/tlr8oxjg/production/7b7f05720074a848850e0705779306c27da5a6cf-1065x597.png?w=3840&q=80&fit=clip&auto=format"
                        alt="Produto"
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      {item.peso > 0 && (
                        <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                          {item.peso}kg
                        </div>
                      )}
                    </div>

                    <div className="p-6 space-y-4 flex-grow">
                      <h2 className="text-xl font-bold text-gray-900 line-clamp-2 h-14">
                        {item.descricao}
                      </h2>

                      <div className="space-y-2">
                        <div className="flex items-center text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-primary"
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
                          <span className="text-sm font-medium">
                            Validade: <span className="font-normal">{formatDate(item.validade)}</span>
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-primary"
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
                          <span className="text-sm font-medium">
                            Categoria: <span className="font-normal">{item.id_cat}</span>
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-primary"
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
                          <span className="text-sm font-medium">
                            Marca: <span className="font-normal">{item.id_marca}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="card-actions p-6 pt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 mt-auto">
                      <p className="text-xl font-bold text-gray-900">
                        {Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL"
                        }).format(Number(item.preco))}
                      </p>
                      {localUser?.categoria === "C" && (
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <input
                            type="number"
                            className="input input-bordered input-sm w-16 text-center"
                            value={quantities[item.id] || "1"}
                            onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                            min="1"
                            aria-label="Quantidade"
                          />
                          <button
                            className="btn btn-primary btn-sm px-4"
                            onClick={() => handleAddToCart(item)}
                          >
                            Adicionar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center bg-base-100 rounded-xl shadow-sm">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-16 w-16 text-gray-300 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nenhum produto encontrado</h2>
                  <p className="text-gray-500 max-w-md">
                    Não encontramos produtos correspondentes à sua busca. Tente outros termos ou entre em contato com o suporte.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});


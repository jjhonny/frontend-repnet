import { Header } from "@/components/header";
import { AuthContext } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

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
  const { user, signOut } = useContext(AuthContext);
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function handleSearchProduct() {
      setLoading(true);
      try {
        const response = await api.get("/produtos");
        const produtosBack = response.data;
        console.log(produtosBack);
        if (produtosBack.length >= 1) {
          setProducts(produtosBack);
        }
      } catch (error) {
        console.log("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    }

    handleSearchProduct();
  }, []);

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Produtos</h1>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="w-full flex flex-wrap justify-center  max-w-7xl mx-auto px-4 mt-6 gap-6">
            {products.length >= 1 ? (
              products.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden w-60"
                >
                  <img
                    src="https://via.placeholder.com/150"
                    alt="Produto"
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-2">
                    <h2 className="text-lg font-semibold">{item.descricao}</h2>
                    <p className="text-gray-500">{item.validade}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-700">{item.peso} KG</p>
                      <p className="text-gray-700 font-bold">
                        R${" "}
                        {Intl.NumberFormat("pt-BR", {
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(item.preco))}
                      </p>
                    </div>
                    <div className="mt-2">
                      <button className="btn btn-primary w-full">
                        Comprar
                      </button>
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
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});

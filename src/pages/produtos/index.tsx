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
  const [products, SetProducts] = useState<ProductsProps[]>([]);
  const [loading, SetLoading] = useState<Boolean>(false);

  /* const categoriaUser = localStorage.getItem("CategoriaUser");
  console.log(categoriaUser); */

  useEffect(() => {
    async function handleSearchProduct() {
      SetLoading(true);
      api
        .get("/produtos")
        .then((response) => {
          const produtosBack = response.data.produtos;
          if (produtosBack.length >= 1) {
            SetProducts(produtosBack);
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          SetLoading(false);
        });
    }

    handleSearchProduct();
  }, []);

  return (
    <>
      <Header />
      <h1 className="flex justify-center mt-6 text-4xl font-bold">
        Produtos {/* - {user.categoria} */}
      </h1>
      {loading ? (
        <div className="flex min-h-screen justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <main className="w-full flex flex-wrap justify-center  max-w-7xl mx-auto px-4 mt-6">
          {products.length >= 1 ? (
            products?.map((item) => (
              <section className="m-4" key={item.id}>
                <div className="card w-64 min-h-60 bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h2 className="card-title">{item.descricao}</h2>
                    <p className="flex justify-start">{item.validade}</p>
                    <div className="flex flex-col">
                      <p>{item.peso} KG</p>
                      <strong>
                        <p>
                          R${" "}
                          {Intl.NumberFormat("pt-BR", {
                            currency: "BRL",
                            minimumFractionDigits: 2,
                          }).format(Number(item.preco))}
                        </p>
                      </strong>
                    </div>
                    <div className="card-actions justify-end">
                      <button className="btn btn-primary">Comprar</button>
                    </div>
                  </div>
                </div>
              </section>
            ))
          ) : (
            <div className="flex justify-center items-center text-2xl">
              {" "}
              Sem produtos cadastrados
            </div>
          )}
        </main>
      )}
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});

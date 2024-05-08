import { InputText } from "@/components/input-text";
import { AuthContext } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { FormEvent, useContext, useState } from "react";
import toast from "react-hot-toast";

export default function NovoProduto() {
  const { signOut, user } = useContext(AuthContext);
  const [descricao, setDescricao] = useState("");
  const [validade, setValidade] = useState("");
  const [peso, setPeso] = useState(0);
  const [preco, setPreco] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [marca, setMarca] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegisterProduct(event: FormEvent) {
    event.preventDefault();

    const dataProduct = {
      descricao,
      validade,
      peso,
      preco,
      categoria,
      marca,
    };

    try {
      setLoading(true);
      const response = await api.post(
        "/representante/cadastro-produto",
        dataProduct
      );
      toast.success("Produto cadastrado com sucesso!");
      setDescricao("");
      setValidade("");
      setPeso(0);
      setPreco(0);
      setCategoria("");
      setMarca("");
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
            <form className="flex flex-col" onSubmit={handleRegisterProduct}>
              <span className="font-bold">Nome do produto</span>
              <InputText
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="grow"
                placeholder="Digite o nome do produto"
              />
              <span className="font-bold">Validade do produto</span>
              <InputText
                type="date"
                value={validade}
                onChange={(e) => setValidade(e.target.value)}
                className="grow"
              />
              <span className="font-bold">Peso do Produto</span>
              <InputText
                type="number"
                value={peso}
                onChange={(e) => setPeso(parseFloat(e.target.value))}
                className="grow"
                placeholder="Digite o peso do produto"
              />
              <span className="font-bold">Preço do produto</span>
              <InputText
                type="number"
                value={preco}
                onChange={(e) => setPreco(parseFloat(e.target.value))}
                className="grow"
                placeholder="Digite o preço do produto"
              />
              <span className="font-bold">Categoria do produto</span>
              <InputText
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="grow"
                placeholder="Digite o preço do produto"
              />
              <span className="font-bold">Marca do produto</span>
              <InputText
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="grow"
                placeholder="Digite a marca do produto"
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

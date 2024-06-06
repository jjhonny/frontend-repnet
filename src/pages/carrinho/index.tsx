/* import { Header } from "@/components/header";
import CartContext from "@/contexts/CartContext";
import Link from "next/link";
import { useContext } from "react";

export default function Carrinho() {
  const { cart, total, addItemCart, removeItemCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <h1>Página carrinho</h1>
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="font-medium text-2xl text-center my-4">Meu carrinho</h1>

        {cart.length === 0 && (
          <div className="flex flex-col justify-center items-center">
            <p className="font-medium">Ops seus carrinho está vazio...</p>
            <Link
              href={user.categoria === "C" ? "/cliente" : "/representante"}
              className="bg-slate-500 my-3 p-1 px-3 text-white font-medium rounded"
            >
              Acessar produtos
            </Link>
          </div>
        )}

        {cart.map((item) => (
          <section
            key={item.id}
            className="flex items-center justify-between border-b-2 border-gray-300"
          >
            <img className="w-28 h-auto" src={item.cover} alt={item.title} />
            <strong>
              Preço:{" "}
              {item.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
            <div className="flex items-center justify-center gap-3">
              <button
                className="bg-slate-600 px-2 rounded text-white font-medium flex items-center justify-center"
                onClick={() => removeItemCart(item)}
              >
                -
              </button>
              <span>{item.amount}</span>
              <button
                className="bg-slate-600 px-2 rounded text-white font-medium flex items-center justify-center"
                onClick={() => addItemCart(item)}
              >
                +
              </button>
            </div>
            <strong className="float-right">
              SubTotal:{" "}
              {item.total.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </strong>
          </section>
        ))}
        {cart.length !== 0 && <p className="font-bold mt-4 ">Total: {total}</p>}
      </div>
    </div>
  );
}
 */

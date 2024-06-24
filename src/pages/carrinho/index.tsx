import { Header } from "@/components/header";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "@/contexts/CartContext";

export default function Carrinho() {
  const { cart, total, removeItemCart } = useCart();

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Meu Carrinho</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex items-center"
              >
                <img
                  src="https://via.placeholder.com/150"
                  alt="Produto"
                  className="w-20 h-20 mr-4"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.descricao}</h2>
                  <p className="text-gray-500">{item.validade}</p>
                  <div className="flex items-center mt-2">
                    <p className="text-gray-700 font-bold">
                      R${" "}
                      {Intl.NumberFormat("pt-BR", {
                        currency: "BRL",
                        minimumFractionDigits: 2,
                      }).format(Number(item.preco))}
                    </p>
                    <span className="ml-4">Quantidade: {item.amount}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-2xl">Carrinho vazio</div>
          )}
        </div>
        <div className="mt-8 flex justify-end">
          <button className="btn btn-primary flex items-center">
            <FaShoppingCart className="mr-2" />
            Finalizar Compra ({cart.reduce(
              (acc, item) => acc + item.amount,
              0
            )}{" "}
            itens)
          </button>
        </div>
        <div className="mt-4 text-right">
          <p className="text-lg font-semibold">Total: {total}</p>
        </div>
      </div>
    </div>
  );
}

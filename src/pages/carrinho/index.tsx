import { Header } from "@/components/header";
import { FaShoppingCart } from "react-icons/fa";

export default function Carrinho() {
  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Meu Carrinho</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Item 1 */}
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Produto"
              className="w-20 h-20 mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">Nome do Produto</h2>
              <p className="text-gray-500">Descrição do produto.</p>
              <p className="text-gray-700 mt-2">R$ 19,99</p>
            </div>
          </div>
          {/* Item 2 */}
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Produto"
              className="w-20 h-20 mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">Nome do Produto</h2>
              <p className="text-gray-500">Descrição do produto.</p>
              <p className="text-gray-700 mt-2">R$ 29,99</p>
            </div>
          </div>
          {/* Item 3 */}
          <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
            <img
              src="https://via.placeholder.com/150"
              alt="Produto"
              className="w-20 h-20 mr-4"
            />
            <div>
              <h2 className="text-lg font-semibold">Nome do Produto</h2>
              <p className="text-gray-500">Descrição do produto.</p>
              <p className="text-gray-700 mt-2">R$ 39,99</p>
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button className="btn btn-primary flex items-center">
            <FaShoppingCart className="mr-2" />
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}

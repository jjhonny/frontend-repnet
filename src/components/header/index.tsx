import { AuthContext, UserProps } from "@/contexts/AuthContex";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import { IoPerson } from "react-icons/io5";
import { MdAddCircleOutline, MdHome, MdLogout } from "react-icons/md";
import { FaBoxes } from "react-icons/fa";
import { useCart } from "@/contexts/CartContext";
import { BsBagCheckFill } from "react-icons/bs";
import { FaDownload, FaPrint } from "react-icons/fa6";
import { useReport } from "@/hooks/useReport";
import { useRouter } from "next/router";

export function Header() {
  const [localUser, setLocalUser] = useState<UserProps | null>(null); // Estado para armazenar dados do localStorage
  const { signOut, user } = useContext(AuthContext);
  const { cart, total } = useCart();
  const [fontSize, setFontSize] = useState(16);
  const { handleDownloadReport, handleGenerateReport } = useReport();
  const router = useRouter();

  // UseEffect para carregar o usuário do localStorage após o carregamento do componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser)); // Converte de volta para objeto e armazena no estado
    }
  }, []);

  // Função para calcular o número total de itens no carrinho
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.amount, 0);
  };

  // Função para obter o número de produtos diferentes no carrinho
  const getUniqueProducts = () => {
    return cart.length;
  };

  // Funções para aumentar e diminuir o tamanho do texto
  const increaseFontSize = () => {
    setFontSize((prevSize) => (prevSize < 24 ? prevSize + 2 : prevSize));
    document.documentElement.style.fontSize = `${fontSize + 2}px`;
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 12 ? prevSize - 2 : prevSize));
    document.documentElement.style.fontSize = `${fontSize - 2}px`;
  };

  // Função para gerar relatório por email
  const generateEmailReport = () => {
    if (localUser) {
      handleGenerateReport(localUser);
      // Fecha o drawer se estiver aberto
      const drawerCheckbox = document.getElementById("my-drawer") as HTMLInputElement;
      if (drawerCheckbox) {
        drawerCheckbox.checked = false;
      }
    }
  };

  // Função para baixar relatório
  const downloadReport = () => {
    if (localUser) {
      handleDownloadReport(localUser);
      // Fecha o drawer se estiver aberto
      const drawerCheckbox = document.getElementById("my-drawer") as HTMLInputElement;
      if (drawerCheckbox) {
        drawerCheckbox.checked = false;
      }
    }
  };

  return (
    <header className="sticky top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        {/* Menu Drawer */}
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label
              htmlFor="my-drawer"
              className="btn btn-ghost hover:bg-gray-100 rounded-lg text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <span className="ml-2">Menu</span>
            </label>
          </div>

          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <div className="menu p-4 w-80 h-full bg-white shadow-lg">
              <div className="flex flex-col h-full justify-between">
                <div className="space-y-2">
                  <div className="pb-4 mb-4 border-b border-gray-100">
                    <span className="text-xl font-semibold text-gray-800">
                      Menu Principal
                    </span>
                  </div>

                  <Link
                    href={
                      localUser?.categoria === "C"
                        ? "/cliente"
                        : "/representante"
                    }
                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                  >
                    <MdHome className="w-5 h-5 mr-3" />
                    Home
                  </Link>

                  <Link
                    href="/produtos"
                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                  >
                    <FaBoxes className="w-5 h-5 mr-3" />
                    Produtos
                  </Link>

                  {localUser?.categoria === "C" && (
                    <Link
                      href="/cliente/pedidos"
                      className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <BsBagCheckFill className="w-5 h-5 mr-3" />
                      Meus Pedidos
                    </Link>
                  )}

                  {localUser?.categoria === "R" && (
                    <div className="space-y-2">
                      <div className="pt-4 pb-2">
                        <span className="text-sm font-medium text-gray-500">
                          Gerenciamento
                        </span>
                      </div>
                      <Link
                        href="/representante/cadastro-produto"
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <MdAddCircleOutline className="w-5 h-5 mr-3" />
                        Cadastrar Produto
                      </Link>
                      <Link
                        href="/representante/cadastro-categoria"
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <MdAddCircleOutline className="w-5 h-5 mr-3" />
                        Cadastrar Categoria
                      </Link>
                      <Link
                        href="/representante/cadastro-marca"
                        className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                      >
                        <MdAddCircleOutline className="w-5 h-5 mr-3" />
                        Cadastrar Marca
                      </Link>
                    </div>
                  )}

                  {localUser?.categoria === "C" && (
                    <Link
                      href="/carrinho"
                      className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      <FiShoppingCart className="w-5 h-5 mr-3" />
                      <span>Carrinho</span>
                      {cart.length > 0 && (
                        <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {getUniqueProducts()}
                        </span>
                      )}
                    </Link>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-gray-100">
                  <Link
                    href={
                      localUser?.categoria === "C"
                        ? "/cliente/perfil"
                        : "/representante/perfil"
                    }
                    className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                  >
                    <IoPerson className="w-5 h-5 mr-3" />
                    Perfil
                  </Link>
                  
                  <div className="dropdown dropdown-right">
                    <label tabIndex={0} className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 cursor-pointer">
                      <FaPrint className="w-5 h-5 mr-3" />
                      <span>Relatórios</span>
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[100] menu shadow bg-white rounded-box w-52 ml-2">
                      <li>
                        <button onClick={generateEmailReport}>
                          <FaPrint className="text-blue-600" />
                          Relatório por Email
                        </button>
                      </li>
                      <li>
                        <button onClick={downloadReport}>
                          <FaDownload className="text-blue-600" />
                          Baixar Relatório
                        </button>
                      </li>
                    </ul>
                  </div>
                  
                  <button
                    onClick={signOut}
                    className="flex items-center w-full px-3 py-2 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <MdLogout className="w-5 h-5 mr-3" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
          {/* Accessibility Controls */}
          <div className="hidden md:flex items-center space-x-2 text-sm">
            <span className="text-gray-600">Acessibilidade</span>
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={decreaseFontSize}
                className="px-2 py-1 rounded hover:bg-white transition-colors"
                title="Diminuir tamanho do texto"
              >
                <span className="text-blue-600 font-semibold">A-</span>
              </button>
              <div className="w-px h-4 bg-gray-300"></div>
              <button
                onClick={increaseFontSize}
                className="px-2 py-1 rounded hover:bg-white transition-colors"
                title="Aumentar tamanho do texto"
              >
                <span className="text-blue-600 font-semibold">A+</span>
              </button>
            </div>
          </div>

          {/* Cart Dropdown */}
          {localUser?.categoria === "C" && (
            <div className="dropdown dropdown-end">
              <button className="btn btn-ghost btn-circle relative">
                <div className="indicator">
                  <FiShoppingCart className="w-6 h-6 text-gray-700" />
                  {cart.length > 0 && (
                    <span className="badge badge-primary badge-sm indicator-item">
                      {getUniqueProducts()}
                    </span>
                  )}
                </div>
              </button>
              <div className="dropdown-content mt-4 card card-compact w-72 bg-white shadow-xl border border-gray-100">
                <div className="card-body">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">
                      {getUniqueProducts()} Produtos
                    </span>
                    <span className="text-gray-600">Total: {total}</span>
                  </div>
                  <Link
                    href="/carrinho"
                    className="btn btn-primary w-full rounded-lg"
                  >
                    Ver carrinho
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* User Dropdown */}
          <div className="dropdown dropdown-end">
            <button className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ">
                <IoPerson className="w-6 h-6 text-gray-600 rounded-full" />
              </div>
              <span className="hidden md:flex flex-nowrap font-medium text-gray-700 whitespace-nowrap">
                {localUser?.razao_social}
              </span>
            </button>
            <ul className="dropdown-content mt-4 menu p-2 bg-white shadow-xl border border-gray-100 rounded-lg w-56">
              <li>
                <Link
                  href={
                    localUser?.categoria === "C"
                      ? "/cliente/perfil"
                      : "/representante/perfil"
                  }
                  className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  <IoPerson className="w-5 h-5 mr-2" />
                  Perfil
                </Link>
              </li>
              <li>
                <button
                  onClick={signOut}
                  className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50"
                >
                  <MdLogout className="w-5 h-5 mr-2" />
                  Sair
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}

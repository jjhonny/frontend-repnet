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

export function Header() {
  const [localUser, setLocalUser] = useState<UserProps | null>(null); // Estado para armazenar dados do localStorage
  const { signOut, user } = useContext(AuthContext);
  const { cart, total } = useCart();
  const [fontSize, setFontSize] = useState(16);

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

  // Funções para aumentar e diminuir o tamanho do texto
  const increaseFontSize = () => {
    setFontSize((prevSize) => (prevSize < 24 ? prevSize + 2 : prevSize));
    document.documentElement.style.fontSize = `${fontSize + 2}px`;
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => (prevSize > 12 ? prevSize - 2 : prevSize));
    document.documentElement.style.fontSize = `${fontSize - 2}px`;
  };

  return (
    <header className="w-full h-20 bg-white/80 flex justify-between items-center px-3 shadow-lg">
      <div>
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Conteúdo da página aqui */}
            <label
              htmlFor="my-drawer"
              className="btn btn-primary drawer-button rounded-xl"
            >
              Menu
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content flex flex-col justify-between">
              <div>
                <li>
                  <Link
                    href={
                      localUser?.categoria === "C"
                        ? "/cliente"
                        : "/representante"
                    }
                  >
                    <span className="flex items-center">
                      <MdHome size={22} className="mr-2" />
                      Home
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/produtos">
                    <span className="flex items-center">
                      <FaBoxes size={22} className="mr-2" />
                      Produtos
                    </span>
                  </Link>
                </li>
                {localUser?.categoria === "C" && (
                  <li>
                    <Link href="/cliente/pedidos">
                      <span className="flex items-center">
                        <BsBagCheckFill size={22} className="mr-2" />
                        Meus Pedidos
                      </span>
                    </Link>
                  </li>
                )}
                {localUser?.categoria === "R" && (
                  <>
                    <li>
                      <Link href="/representante/cadastro-produto">
                        <span className="flex items-center">
                          <MdAddCircleOutline size={22} className="mr-2" />
                          Cadastrar Produto
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/representante/cadastro-categoria">
                        <span className="flex items-center">
                          <MdAddCircleOutline size={22} className="mr-2" />
                          Cadastrar Categoria
                        </span>
                      </Link>
                    </li>
                    <li>
                      <Link href="/representante/cadastro-marca">
                        <span className="flex items-center">
                          <MdAddCircleOutline size={22} className="mr-2" />
                          Cadastrar Marca
                        </span>
                      </Link>
                    </li>
                  </>
                )}

                {localUser?.categoria === "C" && (
                  <li>
                    <Link href="/carrinho">
                      <span className="flex items-center">
                        <FiShoppingCart size={22} className="mr-2" />
                        Carrinho
                        {cart.length > 0 && (
                          <span className="badge badge-primary ml-2">
                            {getTotalItems()}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                )}
              </div>
              <div>
                <li>
                  <Link
                    href={
                      localUser?.categoria === "C"
                        ? "/cliente/perfil"
                        : "/representante/perfil"
                    }
                  >
                    <span className="flex items-center">
                      <IoPerson size={22} className="mr-2" />
                      Perfil
                    </span>
                  </Link>
                </li>
                <li>
                  <button
                    className="flex items-center w-full text-left"
                    onClick={signOut}
                  >
                    <MdLogout size={22} className="mr-2" color="red" />
                    Sair
                  </button>
                </li>
              </div>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-none items-center">
        <div className="d-inline-flex flex-lg align-items-center align-middle ml-4 font-sans font-bold">
          <span className="nav-acessibilidade-text">
            Acessibilidade
            <button
              className="btn btn-sm ml-1"
              id="btnAcessibilidadeZoomMinus"
              title="Diminuir tamanho do texto"
              onClick={decreaseFontSize}
            >
              <strong className="text-cyan-600">A-</strong>
            </button>
            |
            <button
              className="btn btn-sm ml-1"
              id="btnAcessibilidadeZoomPlus"
              title="Aumentar tamanho do texto"
              onClick={increaseFontSize}
            >
              <strong className="text-cyan-600">A+</strong>
            </button>
          </span>
        </div>
        <div className="dropdown dropdown-end">
          {localUser?.categoria === "C" && (
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle"
            >
              <div className="indicator">
                <FiShoppingCart size={24} />
                {cart.length > 0 && (
                  <span className="badge badge-primary badge-sm indicator-item">
                    {getTotalItems()}
                  </span>
                )}
              </div>
            </div>
          )}
          <div
            tabIndex={0}
            className="mt-4 z-[1] card card-compact dropdown-content w-56 bg-base-100 shadow"
          >
            <div className="card-body">
              <span className="font-bold text-lg">{getTotalItems()} Itens</span>
              <span className="mb-1">Total: {total}</span>
              <div className="card-actions">
                <Link
                  href="/carrinho"
                  className="btn btn-primary btn-block rounded-2xl"
                >
                  Ver carrinho
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className=" rounded-full flex justify-center items-center">
              <IoPerson size={26} />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-4 z-[1] p-2 shadow bg-base-100 rounded-box w-56"
          >
            <li>
              <Link
                href={
                  localUser?.categoria === "C"
                    ? "/cliente/perfil"
                    : "/representante/perfil"
                }
                className="text-base flex justify-between"
              >
                Perfil
              </Link>
            </li>
            <li>
              <button
                className="flex justify-between text-base"
                onClick={signOut}
              >
                Sair
                <MdLogout size={18} color="#FF0000" />
              </button>
            </li>
          </ul>
        </div>
        <span className="ml-2 font-bold">{user?.razao_social}</span>
      </div>
    </header>
  );
}

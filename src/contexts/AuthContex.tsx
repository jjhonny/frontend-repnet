import { createContext, ReactNode, useState } from "react";
import { api } from "../services/apiCliente";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import { useNavigate } from "react-router-dom";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
};

type UserProps = {
  id: string;
  cnpj: string;
  email: string;
};

type SignInProps = {
  cnpj: string;
  password: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  const navigate = useNavigate();

  try {
    destroyCookie(undefined, "@nextauth.token");
    navigate("/login");
  } catch {
    console.log("Erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  async function signIn({ cnpj, password }: SignInProps) {
    try {
      const response = await api.post("/login", {
        cnpj,
        password,
      });

      console.log(response.data);

      const { id, email, token } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // Expira em 1 mês
        path: "/",
      });

      setUser({
        id,
        cnpj,
        email,
      });

      // Passar para proximas requisições o nosso token
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      // Redirecionar para a página inicial após o login
      navigate("/");
    } catch (error) {
      console.log("Erro ao acessar", error);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

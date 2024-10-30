import { createContext, ReactNode, useState, useEffect } from "react";
import { api } from "@/services/apiCliente";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import Router, { useRouter } from "next/router";
import toast from "react-hot-toast";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>;
  userTemp: UserProps;
  AuthUserLogin: (credentials: AuthUserLogin) => Promise<void>;
};

export interface UserProps {
  id?: string;
  cnpj?: string;
  cnpjUser?: string;
  email: string;
  razao_social?: string;
  categoria: string;
  token?: string;
}

export type SignInProps = {
  cnpj: string;
  password: string;
};

export type SignUpProps = {
  categoria: string;
  razao_social: string;
  cnpj: string;
  receita_bruta: number;
  email: string;
  password: string;
  passwordC: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

export type AuthUserLogin = {
  cnpj: string;
  categoria: string;
  code: number;
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    localStorage.removeItem("user");
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/login");
    toast.success("Deslogado com sucesso!", {
      position: "top-right",
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  } catch {
    toast.error("Erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>(null);
  const [userTemp, setUserTemp] = useState<UserProps>(null);
  const isAuthenticated = !!user;

  async function signIn({ cnpj, password }: SignInProps) {
    try {
      const response = await api.post("/login", {
        cnpj,
        password,
      });

      const cnpjUser = response.data.cnpj;
      const categoria = response.data.categoria;
      const email = response.data.email;

      setUserTemp({
        cnpjUser,
        categoria,
        email,
      });

      Router.push("/autenticar");
      toast.success("Código enviado para o email", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error(error.response.data.errormessage, {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  }

  async function AuthUserLogin({ cnpj, categoria, code }: AuthUserLogin) {
    console.log(cnpj, categoria, code);

    try {
      const response = await api.post("/autenticar", {
        cnpj,
        categoria,
        code,
      });

      const { token, email } = response.data;

      setUser({
        cnpj,
        categoria,
        email,
        token,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          cnpj,
          categoria,
          email,
          token,
        })
      );

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // Expira em 1 mês
        path: "/",
      });

      // Passar para proximas requisições o nosso token
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      // Redirecionar para a página inicial após o login
      if (response.data.categoria === "C") {
        Router.push("/cliente");
        toast.success("Logado com sucesso!", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      } else {
        Router.push("/representante");
        toast.success("Logado com sucesso!", {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error(error.response.data.errormessage, {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  }

  async function signUp({
    categoria,
    razao_social,
    cnpj,
    email,
    password,
    receita_bruta,
  }: SignUpProps) {
    try {
      const response = await api.post("/cadastro", {
        categoria,
        razao_social,
        cnpj,
        email,
        password,
        receita_bruta,
      });

      Router.push("/login");
      toast.success("Cadastrado com sucesso!", {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } catch (error) {
      toast.error("Erro ao cadastrar");
      toast.error(error.response.data.errormessage, {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signOut,
        signUp,

        userTemp,
        AuthUserLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

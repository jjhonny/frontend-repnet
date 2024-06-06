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
};

type UserProps = {
  id?: string;
  cnpj: string;
  email: string;
  razao_social: string;
  categoria: string;
};

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

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, "@nextauth.token");
    Router.push("/login");
    toast.success("Deslogado com sucesso!", {
      position: "top-right",
    });
  } catch {
    toast.error("Erro ao deslogar");
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>();
  const isAuthenticated = !!user;

  useEffect(() => {
    // tentar pegar algo no cookie
    const { "@nextauth.token": token } = parseCookies();
    if (token) {
      api
        .get("/me")
        .then((response) => {
          const infoUser = response.data;
          /* const { cnpj, categoria, razao_social, email } = response.data;
          localStorage.setItem("CategoriaUser", JSON.stringify(categoria));
          console.log(infoUser); */
          setUser(infoUser);
          console.log(user);
        })
        .catch((e) => {
          console.log(e);
          signOut();
        });
    }

    /* async function InfoUsers() {
      const { "@nextauth.token": token } = parseCookies();
      if (token) {
        try {
          const response = await api.get("/me");
          const { cnpj, categoria, razao_social, email } = response.data;

          setUser({ cnpj, categoria, razao_social, email });
          console.log(user);
        } catch (error) {
          console.log(error);
        }
      }
    }

    InfoUsers(); */
  }, []);

  async function signIn({ cnpj, password }: SignInProps) {
    try {
      const response = await api.post("/login", {
        cnpj,
        password,
      });

      console.log(response.data);

      const { email, token, categoria, razao_social } = response.data;

      setCookie(undefined, "@nextauth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // Expira em 1 mês
        path: "/",
      });

      setUser({
        cnpj,
        email,
        categoria,
        razao_social,
      });

      // Passar para proximas requisições o nosso token
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      // Redirecionar para a página inicial após o login
      if (response.data.categoria === "C") {
        Router.push("/cliente");
        toast.success("Logado com sucesso!");
      } else {
        Router.push("/representante");
        toast.success("Logado com sucesso!");
      }
    } catch (error) {
      toast.error("Erro ao acessar");
      console.log(error);
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
      toast.success("Cadastrado com sucesso!");
    } catch (error) {
      toast.error("Erro ao cadastrar");
      console.log(error);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

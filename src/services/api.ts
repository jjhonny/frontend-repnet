import axios, { AxiosError, AxiosInstance } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenErro";
import router from "next/router";

export function setupAPICliente(ctx = undefined): AxiosInstance {
  // Obtendo os cookies
  const cookies = parseCookies(ctx);

  // Criando a instância do Axios
  const api = axios.create({
    baseURL: "https://teste-backend-eta.vercel.app/",
    headers: {
      Authorization: `Bearer ${cookies["@nextauth.token"]}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  // Adicione este interceptor para logar mais detalhes
  api.interceptors.request.use(
    (config) => {
      console.log("Request URL:", config.url);
      console.log("Request Headers:", config.headers);
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      console.log("Response Data:", response.data);
      return response;
    },
    (error) => {
      console.error("Error Status:", error.response?.status);
      console.error("Error Headers:", error.response?.headers);
      console.error("Error Data:", error.response?.data);
      return Promise.reject(error);
    }
  );

  /*   // Interceptor para tratar respostas e erros
  api.interceptors.response.use(
    (response) => {
      // Sucesso - Retorna a resposta
      return response;
    },
    (error: AxiosError) => {
      // Caso de erro
      if (error.response) {
        // Erro 401 - Não autorizado
        if (error.response.status === 401) {
          if (typeof window !== "undefined") {
            // Redireciona para uma página de não autorizado
            router.push("/nao-autorizado");
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      } else {
        // Erro de conexão ou servidor
        console.error(
          "Erro de rede ou sem resposta do servidor:",
          error.message
        );
      }

      return Promise.reject(error); // Rejeita o erro para ser tratado na chamada
    }
  ); */

  return api;
}

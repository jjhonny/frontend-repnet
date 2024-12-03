import axios, { AxiosError, AxiosInstance } from "axios";
import { parseCookies } from "nookies";
import { AuthTokenError } from "./errors/AuthTokenErro";
import router from "next/router";

export function setupAPICliente(ctx = undefined): AxiosInstance {
  const cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: "https://backend-pi-sigma.vercel.app",
    headers: {
      Authorization: `Bearer ${cookies["@nextauth.token"]}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error.response) {
        if (error.response.status === 401) {
          if (typeof window !== "undefined") {
            router.push("/nao-autorizado");
          } else {
            return Promise.reject(new AuthTokenError());
          }
        }
      } else {
        console.error(
          "Erro de rede ou sem resposta do servidor:",
          error.message
        );
      }
      return Promise.reject(error);
    }
  );

  return api;
}

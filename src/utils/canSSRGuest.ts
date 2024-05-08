import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { parseCookies } from "nookies";

// função para paginas que só pode ser acessadas por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (
    context: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(context);

    // Se o tentar acessar a página tendo já um login salvo redireciona
    if (cookies["@nextauth.token"]) {
      return {
        redirect: {
          destination: "/produtos",
          permanent: false,
        },
      };
    }

    return await fn(context);
  };
}

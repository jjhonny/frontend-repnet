import { canSSRAuth } from "@/utils/canSSRAuth";
import { Header } from "@/components/header";

export default function Representante() {
  return (
    <>
      <Header />
      <h1 className="flex justify-center text-5xl mt-20">
        Pagina Home Representante
      </h1>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});

import { Header } from "@/components/header";
import { canSSRAuth } from "@/utils/canSSRAuth";

export default function Cliente() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-5xl">Pagina Home Cliente</h1>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});

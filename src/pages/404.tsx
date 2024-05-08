import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <h2 className="font-bold text-2xl">404</h2>
      <p className="text-xl my-2">Está página não existe</p>
      <Link className="btn btn-neutral" href="/produtos">
        Voltar para home
      </Link>
    </div>
  );
}

import Link from "next/link";

export function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          RepNet
        </Link>

        <Link href="/login">
          <button className="btn btn-neutral">Entrar</button>
        </Link>
      </div>
    </header>
  );
}

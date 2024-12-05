import FeatureCard from "@/components/landing-page/FeatureCardProps";
import { Footer } from "@/components/landing-page/Footer";
import { Header } from "@/components/landing-page/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary/10 to-white">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-blue-800">
            RepNet: Revolucione sua Representação Comercial
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Aumente suas vendas, simplifique sua gestão e impulsione seus
            resultados!
          </p>
          <Link href="/login">
            <button className="btn btn-neutral btn-md">Comece Agora</button>
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-blue-700">
            Por que escolher o RepNet?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              title="Gestão Simplificada"
              description="Controle pedidos, clientes em um só lugar."
              icon="📊"
            />
            <FeatureCard
              title="Aumento de Produtividade"
              description="Automatize tarefas e foque no que realmente importa: vender."
              icon="🚀"
            />
            <FeatureCard
              title="Relatórios Detalhados"
              description="Tome decisões baseadas em dados com nossos relatórios."
              icon="📈"
            />
          </div>
        </section>

        <section className="bg-blue-600 text-white rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-semibold mb-4">
            Pronto para transformar seu negócio?
          </h2>
          <p className="mb-6">
            Junte-se a centenas de representantes comerciais que já estão
            colhendo os benefícios do RepNet.
          </p>
          <Link href="/login">
            <button className="btn btn-neutral btn-md">Entre em contato</button>
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 text-center text-blue-700">
            O que nossos clientes dizem
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe
                natus excepturi architecto accusantium facilis odio et
                doloremque sit qui eos!"
              </p>
              <p className="font-semibold">
                - Maria Silva, Representante Comercial
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">
                "Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Consectetur eveniet ipsam molestiae quasi reiciendis,
                repudiandae dolorem delectus! Provident, debitis voluptatibus."
              </p>
              <p className="font-semibold">- João Santos, Gerente de Vendas</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

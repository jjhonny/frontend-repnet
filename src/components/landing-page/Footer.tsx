export function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Contato</h3>
            <p>Email: contato@repnet.com</p>
            <p>Telefone: (00) 1234-5678</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Endereço</h3>
            <p>Rua Exemplo, 123</p>
            <p>Cidade - Estado, 12345-678</p>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-2">Redes Sociais</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-300">
                Facebook
              </a>
              <a href="#" className="hover:text-blue-300">
                Twitter
              </a>
              <a href="#" className="hover:text-blue-300">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} RepNet. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

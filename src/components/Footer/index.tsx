export default function Footer() {
  return (
    <footer className="bg-white footer footer-center text-base-content p-4">
      <aside>
        <p>
          Copyright © {new Date().getFullYear()} - Todos os direitos reservados
          por RepNet
        </p>
      </aside>
    </footer>
  );
}

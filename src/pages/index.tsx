import router from "next/router";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    function Redireciona() {
      router.push("/login");
    }

    Redireciona();
  }, []);

  return (
    <main>
      <div className="flex justify-center">
        <span></span>
      </div>
    </main>
  );
}

import router, { Router } from "next/router";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    router.push("/login");
  }, []);

  return (
    <main>
      <div className="flex justify-center">
        <span></span>
      </div>
    </main>
  );
}

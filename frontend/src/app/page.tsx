'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#f1f5f9]">
      <h1 className="text-1xl font-bold text-gray-800 mb-8">
        <p className="text-1xl">Bem vindo!</p> Para começar a utilizar a aplicação acesse http://localhost:3000/clients ou clique no botão abaixo
      </h1>

      <Button onClick={() => router.push("/clients")}> Vamos! </Button>
    </main>
  );
}

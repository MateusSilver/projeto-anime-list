/* eslint-disable @next/next/no-img-element */

import List from "@/components/list";

// Definição da estrutura do objeto Anime que vem do Spring Boot
interface Anime {
  id: number;
  malId: number;
  title: string;
  type: string;
  episodes: number;
  watchedEpisodes: number;
  score: number;
  status: string;
  comments: string;
  imageUrl: string;
}

// Função assíncrona que busca os dados na API do Java
async function getAnimes(): Promise<Anime[]> {
  try {
    // cache: 'no-store' garante que o Next.js sempre pegará os dados frescos do Neon
    const res = await fetch("http://localhost:8080/api/animes", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Falha ao buscar dados da API");
    }

    return res.json();
  } catch (error) {
    console.error("Erro de conexão com o Backend:", error);
    return []; // Retorna lista vazia em caso de falha para não quebrar a tela
  }
}

export default async function Home() {
  const animes = await getAnimes();

  return (
    <main className="container py-5">
      {/* Cabeçalho do Dashboard */}
      <div className="d-flex justify-content-between align-items-center mb-5 border-bottom border-secondary pb-3 flex-wrap">
        <div>
          <h1 className="fw-bold text-truncate mb-1">
            <span className="text-primary">My Anime List Pro</span>
          </h1>
          <p className="text-muted m-0">
            Gerenciamento de acervo pessoal e estatísticas
          </p>
        </div>
        <div className="bg-dark px-4 py-2 rounded-pill border border-secondary">
          <span className="fw-bold text-primary">{animes.length}</span>{" "}
          <span className="text-white">títulos catalogados</span>
        </div>
      </div>

      {/* Grid de Feed Responsivo com Bootstrap */}
      <List initialAnimes={animes} />
    </main>
  );
}

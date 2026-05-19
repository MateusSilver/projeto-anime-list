/* eslint-disable @next/next/no-img-element */
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
      <div className="row g-2">
        {animes.map((anime) => (
          <div key={anime.id} className="col-6 col-sm-4 col-md-4 col-lg-2">
            <div className="card anime-card text-white">
              {/* Container da Imagem de Capa enriquecida pela Jikan */}
              <div className="card-img-container">
                <img
                  src={
                    anime.imageUrl ||
                    "https://placehold.co/400x600/1f2937/ffffff?text=Sem+Capa"
                  }
                  alt={anime.title}
                  className="anime-poster"
                  loading="lazy"
                />
              </div>

              {/* Corpo do Card */}
              <div className="card-body d-flex flex-column justify-content-between p-3">
                <div>
                  <h5
                    className="card-title fw-bold text-truncate mb-2"
                    title={anime.title}
                  >
                    {anime.title}
                  </h5>

                  <div className="d-flex gap-2 mb-3">
                    <span className="badge bg-dark border border-secondary text-capitalize">
                      {anime.type || "TV"}
                    </span>
                    <span className="badge bg-primary">
                      ★ {anime.score ? anime.score.toFixed(0) : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Barra de Progresso de Episódios */}
                <div>
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span>Progresso:</span>
                    <span className="text-truncate fw-semibold">
                      {anime.watchedEpisodes} / {anime.episodes || "??"} ep
                    </span>
                  </div>
                  <div
                    className="progress bg-dark border border-secondary"
                    style={{ height: "6px" }}
                  >
                    <div
                      className="progress-bar bg-primary rounded-pill"
                      role="progressbar"
                      style={{
                        width: anime.episodes
                          ? `${(anime.watchedEpisodes / anime.episodes) * 100}%`
                          : "0%",
                      }}
                    ></div>
                  </div>

                  {/* Status da Obra */}
                  <div className="mt-3 pt-2 border-top border-secondary d-flex justify-content-between align-items-center text-uppercase">
                    <small className="text-muted text-capitalize">Status</small>
                    <span
                      className={`badge ${
                        anime.status === "Completed"
                          ? "bg-info"
                          : anime.status === "On-Hold"
                            ? "bg-warning text-dark"
                            : anime.status === "Dropped"
                              ? "bg-danger text-white"
                              : anime.status === "Plan to Watch"
                                ? "bg-dark text-white"
                                : anime.status === "Watching"
                                  ? "bg-success text-white"
                                  : "bg-warning text-dark"
                      }`}
                    >
                      {anime.status === "Completed"
                        ? "Concluído"
                        : anime.status === "On-Hold"
                          ? "Pausado"
                          : anime.status === "Dropped"
                            ? "Abandonado"
                            : anime.status === "Plan to Watch"
                              ? "Planejo ver"
                              : anime.status === "Watching"
                                ? "Assistindo"
                                : anime.status || "Desconecido"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Feedback visual caso o backend esteja desligado ou vazio */}
        {animes.length === 0 && (
          <div className="col-12 text-center py-5">
            <div
              className="alert alert-dark border border-danger d-inline-block p-4"
              role="alert"
            >
              <h4 className="alert-heading text-danger fw-bold">
                Nenhum dado encontrado
              </h4>
              <p className="mb-0 text-muted">
                Verifique se a sua API Spring Boot está rodando na porta 8080.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

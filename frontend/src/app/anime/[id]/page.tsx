/* eslint-disable @next/next/no-img-element */
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, X } from "lucide-react";
import { useAnimeDetails } from "@/hooks/useAnimeDetails";
import ReviewModal from "@/components/ReviewModal";
import EditAnimeModal from "@/components/EditAnimeModal";
import AnimeDetailsSection from "@/components/AnimeDetailsSection";
import CommunityReviewsSection from "@/components/CommunityReviewsSection";

export default function AnimeDetailsPage() {
  const params = useParams();
  const animeId = (params.id as string) || "";

  // Cérebro isolado no Hook
  const {
    data,
    isLoading,
    error,
    reviews,
    isReviewModalOpen,
    setIsReviewModalOpen,
    isModalOpen,
    setIsModalOpen,
    isImageModalOpen,
    setIsImageModalOpen,
    editForm,
    setEditForm,
    tagsInput,
    setTagsInput,
    isSaving,
    isFetching,
    getHighResImageUrl,
    handleOpenEdit,
    handleSaveEdit,
    fetchJikanData,
    handleLikeReview,
    handleSaveReview,
  } = useAnimeDetails(animeId);

  if (isLoading) {
    return <div className="text-center mt-5">A carregar detalhes...</div>;
  }

  if (error || !data) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger">
          {error || "Anime não encontrado."}
        </div>
        <Link href="/" className="btn btn-primary">
          Voltar para o Acervo
        </Link>
      </div>
    );
  }

  const { anime, globalUserCount, globalAverageScore } = data;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      {/* BACKGROUND DEGRADÊ */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "70vh",
          backgroundImage: `url(${anime.imageUrl || "https://placehold.co/300x400"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(5px)",
          opacity: 0.5,
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      <main
        className="container"
        style={{ position: "relative", zIndex: 1, paddingTop: "125px" }}
      >
        {/* CABEÇALHO */}
        <div className="mb-4">
          <Link href="/" className="text-decoration-none text-body fw-semibold">
            <ArrowLeft size={22} /> Voltar
          </Link>
        </div>

        {/* 1. SEÇÃO DE DETALHES */}
        <AnimeDetailsSection
          anime={anime}
          globalUserCount={globalUserCount}
          globalAverageScore={globalAverageScore}
          getHighResImageUrl={getHighResImageUrl}
          onOpenImageModal={() => setIsImageModalOpen(true)}
          onOpenEdit={handleOpenEdit}
        />

        {/* 2. SEÇÃO DE RESENHAS GLOBAIS */}
        <CommunityReviewsSection
          reviews={reviews}
          animeId={animeId}
          onOpenReviewModal={() => setIsReviewModalOpen(true)}
          onLikeReview={handleLikeReview}
        />

        {/* 3. MODAIS */}
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          initialText={anime.reviewText || ""}
          animeTitle={anime.title || "este anime"}
          onSave={handleSaveReview}
        />

        <EditAnimeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          editForm={editForm}
          setEditForm={setEditForm}
          tagsInput={tagsInput}
          setTagsInput={setTagsInput}
          isSaving={isSaving}
          isFetching={isFetching}
          onSave={handleSaveEdit}
          onFetchJikan={fetchJikanData}
        />

        {/* O Modal de Imagem é tão simples que não precisa de um ficheiro extra */}
        {isImageModalOpen && (
          <div
            className="modal fade show d-block"
            tabIndex={-1}
            style={{
              backgroundColor: "rgba(0,0,0,0.9)",
              zIndex: 1050,
              backdropFilter: "blur(8px)",
            }}
            onClick={() => setIsImageModalOpen(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "90vw", height: "90vh", margin: "auto" }}
            >
              <div className="modal-content bg-transparent border-0 shadow-none w-100 h-100">
                <div
                  className="modal-header border-0 pb-0 justify-content-end position-absolute top-0 end-0 bg-body-transparent text-body"
                  style={{ zIndex: 1 }}
                >
                  <button
                    type="button"
                    className="btn text-white p-3 rounded-circle"
                    onClick={() => setIsImageModalOpen(false)}
                    title="Fechar"
                  >
                    <X fill="currentColor" size={22} />
                  </button>
                </div>
                <div className="modal-body text-center p-0 d-flex justify-content-center align-items-center h-100">
                  <img
                    src={getHighResImageUrl(anime.imageUrl)}
                    alt={anime.title}
                    className="img-fluid rounded-none shadow-lg"
                    style={{
                      maxHeight: "100vh",
                      maxWidth: "100%",
                      objectFit: "contain",
                      cursor: "zoom-out",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsImageModalOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { MessageSquare, Star, ThumbsUp } from "lucide-react";

interface CommunityReviewsSectionProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reviews: any[];
  animeId: string | string[];
  onOpenReviewModal: () => void;
  onLikeReview: (reviewId: number) => void;
}

export default function CommunityReviewsSection({
  reviews,
  animeId,
  onOpenReviewModal,
  onLikeReview,
}: CommunityReviewsSectionProps) {
  return (
    <div className="mt-5">
      <h3 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <MessageSquare size={24} className="text-primary" />
        Resenhas da Comunidade ({reviews.length})
      </h3>

      {reviews.length === 0 ? (
        <div className="alert bg-body-tertiary border-0 text-center py-4 d-flex align-items-center flex-column gap-2 text-body-secondary rounded-4">
          Nenhuma resenha encontrada para este anime. Seja o primeiro a avaliar!
          <button
            className="btn bg-primary text-white rounded-2 fw-bold mt-2"
            onClick={onOpenReviewModal}
          >
            Fazer uma Resenha
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {reviews.slice(0, 3).map((review, idx) => (
            <div key={idx} className="col-12">
              <div className="card border border-secondary-subtle bg-body-tertiary shadow-sm rounded-4 p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <Link
                      href={`/user/${review.userId}`}
                      className="text-decoration-none text-body"
                    >
                      <div
                        className="d-flex align-items-center gap-3"
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          src={
                            review.userImage ||
                            "https://placehold.co/50x50?text=U"
                          }
                          alt={review.userName}
                          className="rounded-circle border border-2 border-secondary-subtle"
                          style={{
                            width: "45px",
                            height: "45px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h6 className="mb-0 fw-bold">{review.userName}</h6>
                          <small className="text-body-secondary d-flex align-items-center gap-1">
                            <Star
                              size={12}
                              className="text-warning"
                              fill="#FFD700"
                            />
                            Nota:{" "}
                            {review.score ? review.score.toFixed(1) : "N/A"}
                          </small>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <button
                    onClick={() => onLikeReview(review.reviewId)}
                    className={`btn btn-sm rounded-pill d-flex align-items-center gap-1 fw-semibold shadow-sm ${
                      review.isLikedByMe
                        ? "btn-secondary"
                        : "btn-outline-secondary"
                    }`}
                    style={{ transition: "all 0.2s" }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                    title={
                      review.isLikedByMe ? "Remover curtida" : "Curtir resenha"
                    }
                  >
                    <ThumbsUp
                      fill={review.isLikedByMe ? "currentColor" : "none"}
                      size={14}
                    />
                    {review.likes || 0}
                  </button>
                </div>
                <p
                  className="card-text text-body"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {review.reviewText}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviews.length > 3 && (
        <div className="text-center mt-3">
          <Link
            href={`/animes/${animeId}/reviews`}
            className="btn btn-primary rounded-pill px-4 fw-bold"
          >
            Ver todas as {reviews.length} resenhas
          </Link>
        </div>
      )}
    </div>
  );
}

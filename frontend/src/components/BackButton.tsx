import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({
  href,
  label = "Voltar",
}: BackButtonProps) {
  return (
    <Link
      href={href}
      className="d-inline-flex text-body text-decoration-none align-items-center gap-2 rounded-pill mb-1 fw-semibold shadow-sm"
      style={{ transition: "all 0.2s" }}
      onMouseOver={(e) =>
        (e.currentTarget.style.transform = "translateX(-4px)")
      }
      onMouseOut={(e) => (e.currentTarget.style.transform = "translateX(0)")}
    >
      <ArrowLeft size={18} />
      {label}
    </Link>
  );
}

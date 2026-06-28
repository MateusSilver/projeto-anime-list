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
      className="d-inline-flex align-items-center gap-2 btn btn-outline-secondary rounded-pill px-4 fw-semibold shadow-sm"
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

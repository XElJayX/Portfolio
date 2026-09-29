import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { btn, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70dvh] flex-col items-start justify-center py-24">
      <p className="font-mono text-sm text-accent">404 · route not found</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">This page didn&apos;t make it to production.</h1>
      <p className="mt-4 max-w-lg text-lg text-muted">The link may be outdated. The work is still here, though.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/#projects" className={btn.primary}>
          See projects <ArrowRight />
        </Link>
        <Link href="/" className={btn.secondary}>
          Home
        </Link>
      </div>
    </Container>
  );
}

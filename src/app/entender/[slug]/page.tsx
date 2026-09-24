import { permanentRedirect } from "next/navigation";
import { getExplainer, isCaseKind } from "@/data/explainers";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function EntenderSlugRedirect({ params }: Props) {
  const { slug } = await params;
  const e = getExplainer(slug);
  if (e && isCaseKind(e.kind)) {
    permanentRedirect(`/noticias/${slug}`);
  }
  permanentRedirect(`/glossario/${slug}`);
}

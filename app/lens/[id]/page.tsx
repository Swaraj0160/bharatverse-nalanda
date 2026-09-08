import { LensPage } from "@/components/lens/LensPage";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LensPage siteId={id} />;
}

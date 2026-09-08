import { SitePage } from "@/components/shell/SitePage";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SitePage siteId={id} />;
}

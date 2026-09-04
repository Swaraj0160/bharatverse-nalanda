import { PlayClient } from "@/components/campaign/PlayClient";

export default async function Page({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  return <PlayClient levelId={level} />;
}

import type { PEvent, Player } from "@/lib/pachisi/engine";

const KINGS = ["Devapala", "Dharmapala", "Mahipala", "Gopala"];

export function chronicle(log: PEvent[], winner: Player, lang: "en" | "hi"): string[] {
  const king = KINGS[Math.floor(Math.random() * KINGS.length)];
  const caps = log.filter((e) => e.kind === "capture");
  const capsByYou = caps.filter((e) => e.by === "you").length;
  const capsByAi = caps.filter((e) => e.by === "ai").length;
  const dark = log.filter((e) => e.kind === "move" && e.detail === "8").length;
  const graces = log.filter((e) => e.kind === "grace").length;

  if (lang === "hi") {
    const out = [`${king} के राज्य में, एक लिपिक और एक नदी-व्यापारी वस्त्र पर बैठे।`];
    if (capsByYou) out.push(`लिपिक ने व्यापारी की गोटी ${capsByYou > 1 ? "दो बार" : "एक बार"} मारी; वह तसले से फिर चली।`);
    if (capsByAi) out.push(`व्यापारी ने लिपिक की गोटी ${capsByAi > 1 ? "दो बार" : "एक बार"} पीछे भेजी।`);
    if (dark >= 2) out.push(`${dark} बार कौड़ियाँ सर्वथा अंधकार में गिरीं, और आठ की चाल मिली।`);
    if (graces >= 3) out.push(`कृपा-दान बार-बार मिले।`);
    out.push(
      `${winner === "you" ? "लिपिक" : "व्यापारी"} ने दीपक बुझने से पहले दोनों गोटियाँ केंद्र तक पहुँचाईं।`,
    );
    return out;
  }

  const out = [`In the reign of ${king}, a scribe and a river-merchant sat down at the cloth.`];
  if (capsByYou)
    out.push(
      `The scribe struck the merchant's piece ${capsByYou > 1 ? "twice" : "once"}; each time it walked home from the tray.`,
    );
  if (capsByAi)
    out.push(`The merchant sent the scribe's piece back ${capsByAi > 1 ? "twice" : "once"}.`);
  if (dark >= 2)
    out.push(`${dark} times the shells fell all dark, and the throw was eight.`);
  if (graces >= 3) out.push(`Grace throws came again and again.`);
  out.push(
    `${winner === "you" ? "The scribe" : "The merchant"} brought both pieces to the centre before the lamps guttered.`,
  );
  return out;
}

import {MatchInfoSection} from "@/widgets/Match/MatchInfoSection";
import {MatchTimelineSection} from "@/widgets/Match/MatchTimelineSection";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({params}: PageProps) {
  const { id } = await params;
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <MatchInfoSection id={Number(id)} />

      <MatchTimelineSection />
    </main>
  );
}
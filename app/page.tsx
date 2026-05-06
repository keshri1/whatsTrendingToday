import { Suspense } from "react";
import { Metadata } from "next";
import { format } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/layout/Hero";
import DateNav from "@/components/layout/DateNav";
import PlatformTabs from "@/components/layout/PlatformTabs";
import TrendGrid from "@/components/platform/TrendGrid";
import TrendGridSkeleton from "@/components/ui/TrendGridSkeleton";
import Footer from "@/components/layout/Footer";

export const revalidate = 3600; // ISR: rebuild every hour

interface PageProps {
  searchParams: { date?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const date = searchParams.date ?? new Date().toISOString().split("T")[0];
  const formatted = format(new Date(date + "T12:00:00"), "MMMM d, yyyy");
  return {
    title: `Trending Today — ${formatted}`,
    description: `See what's trending on YouTube, TikTok, Instagram, Reddit, X/Twitter and Google on ${formatted}. Top viral videos, posts and searches worldwide.`,
    alternates: { canonical: `https://whatstrendingtoday.com${date !== new Date().toISOString().split("T")[0] ? `?date=${date}` : ""}` },
  };
}

export default function HomePage({ searchParams }: PageProps) {
  const today = new Date().toISOString().split("T")[0];
  const date = searchParams.date ?? today;
  const isToday = date === today;

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero date={date} isToday={isToday} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <DateNav currentDate={date} />
          <PlatformTabs>
            <Suspense fallback={<TrendGridSkeleton />}>
              <TrendGrid date={date} />
            </Suspense>
          </PlatformTabs>
        </div>
      </main>
      <Footer />
    </>
  );
}

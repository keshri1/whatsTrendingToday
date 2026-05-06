import fs from "fs/promises";
import path from "path";
import type { DailyDigest } from "@/types";

const CACHE_DIR = path.resolve(process.cwd(), ".cache/digests");
const TTL_MS = 4 * 60 * 60 * 1000; // 4 hours

export function todayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export async function getCachedDigest(date: string): Promise<DailyDigest | null> {
  try {
    const file = path.join(CACHE_DIR, `${date}.json`);
    const stat = await fs.stat(file);
    const age = Date.now() - stat.mtimeMs;
    if (age > TTL_MS && date === todayKey()) return null; // stale for today
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as DailyDigest;
  } catch {
    return null;
  }
}

export async function setCachedDigest(digest: DailyDigest): Promise<void> {
  await fs.mkdir(CACHE_DIR, { recursive: true });
  const file = path.join(CACHE_DIR, `${digest.date}.json`);
  await fs.writeFile(file, JSON.stringify(digest, null, 2), "utf8");
}

export async function listCachedDates(): Promise<string[]> {
  try {
    const files = await fs.readdir(CACHE_DIR);
    return files
      .filter(f => f.endsWith(".json"))
      .map(f => f.replace(".json", ""))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

declare module "google-trends-api" {
  interface DailyTrendsOptions {
    geo?: string;
  }

  export function dailyTrends(options: DailyTrendsOptions): Promise<string>;
}

interface UsageReport {
  days: number;
  startDate: Date;
  endDate: Date;
  lines: UsageReportLine[];
}

interface UsageReportLine {
  date: Date;
  product: string;
  sku: string;
  quantity: number;
  unitType: 'minute' | 'gb-day' | 'user-month' | 'gb' | string;
  pricePerUnit: number;
  multiplier: number;
  owner: string;
  repositorySlug: string;
  username: string;
  actionsWorkflow: string;
  notes: string;
}

type UsageReportCallback = (usageReport: UsageReport, percent: number) => void;

export { UsageReport, UsageReportLine, UsageReportCallback };
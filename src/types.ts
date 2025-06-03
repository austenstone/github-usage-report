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
  unitType: string;
  pricePerUnit: number;
  grossAmount: number;
  discountAmount: number;
  netAmount: number;
  username: string;
  organization: string;
  repositoryName: string;
  workflowName: string;
  workflowPath: string;
  costCenterName: string;
}

type UsageReportCallback = (usageReport: UsageReport, percent: number) => void;

export { UsageReport, UsageReportLine, UsageReportCallback };
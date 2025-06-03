interface UsageReport {
  days: number;
  startDate: Date;
  endDate: Date;
  lines: UsageReportLine[];
}

interface UsageReportLine {
  date: Date;
  product: 'actions' | 'copilot' | 'git_lfs' | 'packages' | string;
  sku: 'actions_linux' | 'actions_linux_4_core' | 'actions_macos' | 'actions_storage' | 'actions_windows' | 'copilot_enterprise' | 'copilot_for_business' | 'git_lfs_storage' | 'packages_storage' | 'actions_linux_64_core' | 'actions_linux_8_core' | 'actions_linux_2_core_advanced' | 'actions_windows_8_core' | 'actions_self_hosted_macos' | 'actions_unknown' | string;
  quantity: number;
  unitType: 'minutes' | 'gigabyte-hours' | 'user-months' | string;
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

interface ModelUsageReport {
  days: number;
  startDate: Date;
  endDate: Date;
  lines: ModelUsageReportLine[];
}

interface ModelUsageReportLine {
  timestamp: Date;
  user: string;
  model: string;
  requestsUsed: number;
  exceedsMonthlyQuota: boolean;
  totalMonthlyQuota: string; // Can be "Unlimited" or a number
}

type ModelUsageReportCallback = (usageReport: ModelUsageReport, percent: number) => void;

export { UsageReport, UsageReportLine, UsageReportCallback, ModelUsageReport, ModelUsageReportLine, ModelUsageReportCallback };
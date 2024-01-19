import { UsageReport, UsageReportLine } from "./types";

const readGithubUsageReport = async (data: string): Promise<UsageReport> => {
  return new Promise((resolve) => {
    const usageReport: UsageReport = {
      days: 0,
      startDate: new Date(),
      endDate: new Date(),
      lines: [],
    };

    data.split('\n').forEach((line, index) => {
      if (index == 0) return;
      const csv = line.split(',');
      const data: UsageReportLine = {
        date: new Date(Date.parse(csv[0])),
        product: csv[1],
        sku: csv[2],
        quantity: Number(csv[3]),
        unitType: csv[4],
        pricePerUnit: Number(csv[5]),
        multiplier: Number(csv[6]),
        owner: csv[7],
        repositorySlug: csv[8],
        username: csv[9],
        actionsWorkflow: csv[10],
        notes: csv[11],
      };
      if (data.product != null) {
        usageReport.lines.push(data);
      }
    });
    usageReport.startDate = usageReport.lines[0].date;
    usageReport.endDate = usageReport.lines[usageReport.lines.length - 1].date;
    usageReport.days = (usageReport.endDate.getTime() - usageReport.startDate.getTime()) / (1000 * 60 * 60 * 24);
    resolve(usageReport);
  });
};

export { readGithubUsageReport };
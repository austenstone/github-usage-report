import { UsageReport, UsageReportCallback, UsageReportLine } from "./types";

const readGithubUsageReport = async (data: string, cb?: UsageReportCallback): Promise<UsageReport> => {
  return new Promise((resolve) => {
    let percent = 0;
    let total = 0;
    let done = 0;
    const usageReport: UsageReport = {
      days: 0,
      startDate: new Date(),
      endDate: new Date(),
      lines: [],
    };

    const lines = data.split('\n');
    total = lines.length;
    lines.forEach((line, index) => {
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
        if (cb) cb(usageReport, percent);
        usageReport.lines.push(data);
      }
      done++;
      percent = Math.round((done / total) * 100);
    });
    usageReport.startDate = usageReport.lines[0].date;
    usageReport.endDate = usageReport.lines[usageReport.lines.length - 1].date;
    usageReport.days = (usageReport.endDate.getTime() - usageReport.startDate.getTime()) / (1000 * 60 * 60 * 24);
    resolve(usageReport);
  });
};

export { readGithubUsageReport };
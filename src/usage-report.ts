import { UsageReport, UsageReportLine } from "./types";

const readGithubUsageReportLine = (line: string): UsageReportLine => {
  const csv = line.split(',').map(field => field.replace(/^"|"$/g, ''));
  if (csv.length < 15) {
    throw new Error(`Invalid line format: "${line}"`);
  }
  return {
    date: new Date(Date.parse(csv[0])),
    product: csv[1],
    sku: csv[2],
    quantity: Number(csv[3]),
    unitType: csv[4],
    pricePerUnit: Number(csv[5]),
    grossAmount: Number(csv[6]),
    discountAmount: Number(csv[7]),
    netAmount: Number(csv[8]),
    username: csv[9],
    organization: csv[10],
    repositoryName: csv[11],
    workflowName: csv[12],
    workflowPath: csv[13],
    costCenterName: csv[14],
  };
}

const readGithubUsageReport = async (data: string): Promise<UsageReport> => {
  return new Promise((resolve) => {
    const usageReportLines: UsageReportLine[] = [];

    const lines = data.split(/\r?\n/);
    lines.forEach((line, index) => {
      if (index == 0 || line.length < 1) return;
      const data = readGithubUsageReportLine(line);
      usageReportLines.push(data);
    });

    const startDate = usageReportLines[0].date;
    const endDate = usageReportLines[usageReportLines.length - 1].date;
    resolve({
      startDate,
      endDate,
      days: (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
      lines: usageReportLines,
    });
  });
};

export { readGithubUsageReport, readGithubUsageReportLine };
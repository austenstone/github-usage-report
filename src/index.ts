import { createReadStream, readFileSync } from 'fs';
import { createInterface } from 'readline';
import { UsageReport, UsageReportLine } from './types';
import { readGithubUsageReportLine, readGithubUsageReport } from './usage-report';


const readGithubUsageReportFileSync = async (fileName: string): Promise<UsageReport> => {
  const data = readFileSync(fileName, 'utf8');
  return readGithubUsageReport(data);
};

const readGithubUsageReportFile = async (fileName: string, newLine?: (line?: UsageReportLine) => void): Promise<UsageReport> => {
  return new Promise((resolve, reject) => {
    const usageReportLines: UsageReportLine[] = [];
    const rl = createInterface({
      input: createReadStream(fileName),
      crlfDelay: Infinity
    });

    let isFirstLine = true;
    rl.on('line', (line) => {
      if (isFirstLine) {
        isFirstLine = false;
        return;
      }
      if (line.length < 1) return;
      const data = readGithubUsageReportLine(line);
      usageReportLines.push(data);
      if (newLine) {
        newLine(data);
      }
    });

    rl.on('close', () => {
      const startDate = usageReportLines[0].date;
      const endDate = usageReportLines[usageReportLines.length - 1].date;
      resolve({
        startDate,
        endDate,
        days: (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24),
        lines: usageReportLines,
      });
    });

    rl.on('error', (err) => {
      reject(err);
    });
  });
}

export { readGithubUsageReportFile, readGithubUsageReportFileSync, readGithubUsageReport, UsageReport, UsageReportLine };
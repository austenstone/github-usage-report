// Node.js-specific functionality for file operations
import { createReadStream, readFileSync } from 'fs';
import { createInterface } from 'readline';
import { UsageReport, UsageReportLine, ModelUsageReport, ModelUsageReportLine } from './types';
import { readGithubUsageReportLine, readGithubUsageReport, readModelUsageReportLine, readModelUsageReport } from './usage-report';

export const readGithubUsageReportFileSync = async (fileName: string): Promise<UsageReport> => {
  const data = readFileSync(fileName, 'utf8');
  return readGithubUsageReport(data);
};

export const readGithubUsageReportFile = async (fileName: string, newLine?: (line?: UsageReportLine) => void): Promise<UsageReport> => {
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
};

export const readModelUsageReportFileSync = async (fileName: string): Promise<ModelUsageReport> => {
  const data = readFileSync(fileName, 'utf8');
  return readModelUsageReport(data);
};

export const readModelUsageReportFile = async (fileName: string, newLine?: (line?: ModelUsageReportLine) => void): Promise<ModelUsageReport> => {
  return new Promise((resolve, reject) => {
    const usageReportLines: ModelUsageReportLine[] = [];
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
      const data = readModelUsageReportLine(line);
      usageReportLines.push(data);
      if (newLine) {
        newLine(data);
      }
    });

    rl.on('close', () => {
      const startDate = usageReportLines[0]?.timestamp || new Date();
      const endDate = usageReportLines[usageReportLines.length - 1]?.timestamp || startDate;
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
};

// Re-export core functionality
export { readGithubUsageReport, readGithubUsageReportLine, readModelUsageReport, readModelUsageReportLine } from './usage-report';
export { UsageReport, UsageReportLine, UsageReportCallback, ModelUsageReport, ModelUsageReportLine, ModelUsageReportCallback } from './types';

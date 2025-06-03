# GitHub Usage Report Library

A TypeScript library to read and process GitHub usage data and model usage data from CSV files.

## Features

- Parse GitHub Actions usage reports from CSV files
- Parse model usage reports (e.g., AI model interactions) from CSV files
- Support for both streaming (async) and direct (sync) file reading
- Works in both Node.js and web environments
- TypeScript support with full type definitions
- Optional line-by-line processing callbacks

## Installation

```bash
npm install github-usage-report
```

## Usage

This library supports both Node.js and web environments through different import paths:

### Node.js Usage (with file system access)

For Node.js applications, you can import the full library which includes file reading capabilities:

```typescript
import { readGithubUsageReportFile, readGithubUsageReportFileSync, readModelUsageReportFile, readModelUsageReportFileSync } from 'github-usage-report';

// GitHub Actions usage reports
const githubReport = await readGithubUsageReportFile('path/to/usage-report.csv', (line) => {
  console.log(`Processing: ${line.date} - ${line.product}`);
});

// Model usage reports  
const modelReport = await readModelUsageReportFile('path/to/model-usage.csv', (line) => {
  console.log(`Processing: ${line.user} - ${line.model}`);
});

// Sync file reading
const report = await readGithubUsageReportFileSync('path/to/usage-report.csv');
console.log(`Total lines: ${report.lines.length}`);
```

### Web/Browser Usage (without file system dependencies)

For web applications or environments where you don't need file system access, import from the core module:

```typescript
import { readGithubUsageReport, readModelUsageReport } from 'github-usage-report/core';

// Parse GitHub Actions CSV data from string (e.g., from a file upload or API)
const githubCsvData = `Date,Product,SKU,...
2023-01-01,Actions,minutes,...`;

const githubReport = await readGithubUsageReport(githubCsvData);

// Parse model usage CSV data from string
const modelCsvData = `Timestamp,User,Model,Requests Used,Exceeds Monthly Quota,Total Monthly Quota
2025-06-02T22:34:09Z,bspann,claude-sonnet-4,1.00,false,Unlimited`;

const modelReport = await readModelUsageReport(modelCsvData);
```
console.log(`Report covers ${report.days} days from ${report.startDate} to ${report.endDate}`);
```

### Universal Usage

You can also import specific functions based on your needs:

```typescript
// Import only what you need from core (works everywhere)
import { readGithubUsageReport, readModelUsageReport, UsageReport, UsageReportLine, ModelUsageReport, ModelUsageReportLine } from 'github-usage-report/core';

// Import Node.js specific functions (works only in Node.js)
import { readGithubUsageReportFile, readGithubUsageReportFileSync, readModelUsageReportFile, readModelUsageReportFileSync } from 'github-usage-report/node';
```

### Report Structure

The library returns different report objects based on the data type:

#### GitHub Usage Report
```typescript
{
  startDate: Date,     // First date in the report
  endDate: Date,       // Last date in the report  
  days: number,        // Number of days covered
  lines: UsageReportLine[] // Array of parsed GitHub usage data
}
```

#### Model Usage Report
```typescript
{
  startDate: Date,     // First timestamp in the report
  endDate: Date,       // Last timestamp in the report  
  days: number,        // Number of days covered
  lines: ModelUsageReportLine[] // Array of parsed model usage data
}
```

### Model Usage Report Format

The model usage report expects CSV files with this format:

```csv
Timestamp,User,Model,Requests Used,Exceeds Monthly Quota,Total Monthly Quota
2025-06-02T22:34:09Z,bspann,claude-sonnet-4,1.00,false,Unlimited
2025-06-02T22:35:15Z,jdoe,gpt-4,2.50,false,100
```

**Fields:**
- **Timestamp**: ISO 8601 format (e.g., `2025-06-02T22:34:09Z`)
- **User**: String username
- **Model**: String model name
- **Requests Used**: Numeric value (can be decimal)
- **Exceeds Monthly Quota**: Boolean (`true` or `false`)
- **Total Monthly Quota**: String (either "Unlimited" or a numeric value)

## Getting Your GitHub Usage Report

To generate a GitHub usage report:

1. Go to your GitHub organization or personal account settings
2. Navigate to "Billing and plans" → "Actions"
3. Click "Usage" and export your data as CSV

See [Viewing your GitHub Actions usage](https://docs.github.com/en/billing/managing-billing-for-github-actions/viewing-your-github-actions-usage) for detailed instructions.

## Development

### 🔨 Build
```bash
npm run build
```

### 🧪 Test
```bash
npm test
```

### 🏃 Run
```bash
npm start
```

### 🧹 Lint 
```bash
npm run lint
```

## License

This project is open source.
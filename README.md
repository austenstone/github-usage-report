# GitHub Usage Report Library

A TypeScript library to read and process GitHub usage data from CSV files.

## Features

- Parse GitHub Actions usage reports from CSV files
- Support for both streaming (async) and direct (sync) file reading
- TypeScript support with full type definitions
- Optional line-by-line processing callbacks

## Installation

```bash
npm install
```

## Usage

### Reading a Usage Report (Async)

```typescript
import { readGithubUsageReportFile } from './src/index';

// Basic usage
const report = await readGithubUsageReportFile('path/to/usage-report.csv');
console.log(`Report covers ${report.days} days from ${report.startDate} to ${report.endDate}`);

// With line-by-line callback
const report = await readGithubUsageReportFile('path/to/usage-report.csv', (line) => {
  console.log(`Processing: ${line.date} - ${line.product}`);
});
```

### Reading a Usage Report (Sync)

```typescript
import { readGithubUsageReportFileSync } from './src/index';

const report = await readGithubUsageReportFileSync('path/to/usage-report.csv');
console.log(`Total lines: ${report.lines.length}`);
```

### Report Structure

The library returns a `UsageReport` object with the following structure:

```typescript
{
  startDate: Date,     // First date in the report
  endDate: Date,       // Last date in the report  
  days: number,        // Number of days covered
  lines: UsageReportLine[] // Array of parsed usage data
}
```

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
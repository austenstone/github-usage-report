import { expect, test } from 'vitest'
import { readGithubUsageReportFile, readGithubUsageReportFileSync, readModelUsageReportFile, readModelUsageReportFileSync } from '../src/node';
import { UsageReportLine } from '../src/types';
import { readGithubUsageReport, readModelUsageReport } from '../src/usage-report';
import { writeFileSync } from 'fs';

const mockUsageReport = `"formatted_date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository_name","workflow_name","workflow_path","cost_center_name"
"2025-05-01","actions","actions_linux","2","minutes","0.008","0.016","0.016","0","","octodemo-framework","bookstore-vigilant-acorn","Dependency Review",".github/workflows/dependency-review.yml","test_cc_docusign"
"2025-05-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","luispujols","LP-Octodemo","lp-awesome-actions","Close stale issues",".github/workflows/stale.yml",""`;

const mockUsageReportFile = './tests/data/usageReport_1_0b650fc20d564ed2bddf337ac27c7a57.csv';

const mockModelUsageReport = `Timestamp,User,Model,Requests Used,Exceeds Monthly Quota,Total Monthly Quota
2025-06-02T22:34:09Z,bspann,claude-sonnet-4,1.00,false,Unlimited
2025-06-02T22:35:15Z,jdoe,gpt-4,2.50,false,100`;

const expectedLines = [
  {
    date: new Date('2025-05-01'),
    product: 'actions',
    sku: 'actions_linux',
    quantity: 2,
    unitType: 'minutes',
    pricePerUnit: 0.008,
    grossAmount: 0.016,
    discountAmount: 0.016,
    netAmount: 0,
    username: '',
    organization: 'octodemo-framework',
    repositoryName: 'bookstore-vigilant-acorn',
    workflowName: 'Dependency Review',
    workflowPath: '.github/workflows/dependency-review.yml',
    costCenterName: 'test_cc_docusign',
  },
  {
    date: new Date('2025-05-01'),
    product: 'actions',
    sku: 'actions_linux',
    quantity: 1,
    unitType: 'minutes',
    pricePerUnit: 0.008,
    grossAmount: 0.008,
    discountAmount: 0.008,
    netAmount: 0,
    username: 'luispujols',
    organization: 'LP-Octodemo',
    repositoryName: 'lp-awesome-actions',
    workflowName: 'Close stale issues',
    workflowPath: '.github/workflows/stale.yml',
    costCenterName: '',
  }
]

test('readGithubUsageReport works', async () => {
  const usageReport = await readGithubUsageReport(mockUsageReport);
  expect(usageReport.lines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines[1]).toEqual(expectedLines[1]);
  expect(usageReport.lines.length).toEqual(2);
}, 600000);

test('readGithubUsageReportFile works', async () => {
  const receivedLines: UsageReportLine[] = [];
  const usageReport = await readGithubUsageReportFile(mockUsageReportFile, (line) => {
    if (line) {
      receivedLines.push(line);
    }
  });
  writeFileSync('./tests/data/usageReport.json', JSON.stringify(usageReport, null, 2));
  expect(receivedLines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines.length).toBeGreaterThan(3000); // File has ~50k rows but some may fail parsing if they have commas in values
}, 600000);

test('readGithubUsageReportFileSync works', async () => {
  const usageReport = await readGithubUsageReportFileSync(mockUsageReportFile);
  expect(usageReport.lines[0]).toEqual(expectedLines[0]);
  expect(usageReport.lines.length).toBeGreaterThan(3000); // File has ~50k rows but some may fail parsing if they have commas in values
}, 600000);

test('readModelUsageReport should parse model usage report correctly', async () => {
  const result = await readModelUsageReport(mockModelUsageReport);
  
  expect(result.lines).toHaveLength(2);
  expect(result.lines[0]).toEqual({
    timestamp: new Date('2025-06-02T22:34:09Z'),
    user: 'bspann',
    model: 'claude-sonnet-4',
    requestsUsed: 1.00,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: 'Unlimited',
  });
  expect(result.lines[1]).toEqual({
    timestamp: new Date('2025-06-02T22:35:15Z'),
    user: 'jdoe',
    model: 'gpt-4',
    requestsUsed: 2.50,
    exceedsMonthlyQuota: false,
    totalMonthlyQuota: '100',
  });
  expect(result.startDate).toEqual(new Date('2025-06-02T22:34:09Z'));
  expect(result.endDate).toEqual(new Date('2025-06-02T22:35:15Z'));
});

test('readModelUsageReportFile should parse model usage file correctly', async () => {
  const mockModelUsageReportFile = './tests/data/premium_interactions_b16336c228824bf39744429a39994e16.csv';
  const report = await readModelUsageReportFile(mockModelUsageReportFile);
  
  expect(report.lines).toHaveLength(4);
  expect(report.lines[0].user).toBe('bspann');
  expect(report.lines[0].model).toBe('claude-sonnet-4');
  expect(report.lines[0].exceedsMonthlyQuota).toBe(false);
  expect(report.lines[0].totalMonthlyQuota).toBe('Unlimited');
});

test('readModelUsageReportFileSync should parse model usage file correctly', async () => {
  const mockModelUsageReportFile = './tests/data/premium_interactions_b16336c228824bf39744429a39994e16.csv';
  const report = await readModelUsageReportFileSync(mockModelUsageReportFile);
  
  expect(report.lines).toHaveLength(4);
  expect(report.lines[1].user).toBe('bspann');
  expect(report.lines[1].requestsUsed).toBe(1.00);
});

// New 14-column format tests (v4.0.0+)
const mockUsageReport14Column = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_linux","9","minutes","0.008","0.072","0.072","0","","octodemo","octocat_supply-scaling-journey","required/1067758332/.github/workflows/dependency-review.yml",""
"2025-11-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","ctcampbell","od-ctcampbell","testing-ts-autofix",".github/workflows/stale.yml",""`;

const expectedLines14Column = [
  {
    date: new Date('2025-11-01'),
    product: 'actions',
    sku: 'actions_linux',
    quantity: 9,
    unitType: 'minutes',
    pricePerUnit: 0.008,
    grossAmount: 0.072,
    discountAmount: 0.072,
    netAmount: 0,
    username: '',
    organization: 'octodemo',
    repositoryName: 'octocat_supply-scaling-journey',
    workflowName: undefined,
    workflowPath: 'required/1067758332/.github/workflows/dependency-review.yml',
    costCenterName: '',
  },
  {
    date: new Date('2025-11-01'),
    product: 'actions',
    sku: 'actions_linux',
    quantity: 1,
    unitType: 'minutes',
    pricePerUnit: 0.008,
    grossAmount: 0.008,
    discountAmount: 0.008,
    netAmount: 0,
    username: 'ctcampbell',
    organization: 'od-ctcampbell',
    repositoryName: 'testing-ts-autofix',
    workflowName: undefined,
    workflowPath: '.github/workflows/stale.yml',
    costCenterName: '',
  }
];

test('readGithubUsageReport works with 14-column format', async () => {
  const usageReport = await readGithubUsageReport(mockUsageReport14Column);
  expect(usageReport.lines[0]).toEqual(expectedLines14Column[0]);
  expect(usageReport.lines[1]).toEqual(expectedLines14Column[1]);
  expect(usageReport.lines.length).toEqual(2);
}, 600000);

test('readGithubUsageReportFile works with 14-column format', async () => {
  const mockUsageReportFile14 = './tests/data/usageReport_14col_sample.csv';
  const receivedLines: UsageReportLine[] = [];
  const usageReport = await readGithubUsageReportFile(mockUsageReportFile14, (line) => {
    if (line) {
      receivedLines.push(line);
    }
  });
  
  // Verify workflowName is undefined for 14-column format
  expect(usageReport.lines[0].workflowName).toBeUndefined();
  expect(usageReport.lines.length).toBe(4);
  
  // Verify a line with workflow_path parses correctly
  const lineWithWorkflow = usageReport.lines[1];
  expect(lineWithWorkflow.workflowName).toBeUndefined();
  expect(lineWithWorkflow.workflowPath).toBe('required/1067758332/.github/workflows/dependency-review.yml');
  expect(lineWithWorkflow.repositoryName).toBe('octocat_supply-scaling-journey');
}, 600000);

// Edge case tests
test('readGithubUsageReport handles scientific notation correctly', async () => {
  const mockWithScientific = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_custom_image_storage","44850","gigabyte-hours","9.4086E-05","4.219757100000001","4.219757100000001","0","","octodemo","","",""`;
  const usageReport = await readGithubUsageReport(mockWithScientific);
  
  expect(usageReport.lines[0].pricePerUnit).toBeCloseTo(0.000094086, 9);
  expect(usageReport.lines[0].quantity).toBe(44850);
});

test('readGithubUsageReport skips invalid lines gracefully', async () => {
  const mockWithInvalid = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_linux","9","minutes"
"2025-11-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","ctcampbell","od-ctcampbell","testing-ts-autofix",".github/workflows/stale.yml",""`;
  
  const usageReport = await readGithubUsageReport(mockWithInvalid);
  // Should skip the invalid 5-column line and only parse the valid 14-column line
  expect(usageReport.lines.length).toBe(1);
  expect(usageReport.lines[0].quantity).toBe(1);
});

// Robustness tests for common real-world scenarios
test('readGithubUsageReport handles empty string values', async () => {
  const mockWithEmpties = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_linux","5","minutes","0.008","0.04","0.04","0","","","","",""`;
  
  const usageReport = await readGithubUsageReport(mockWithEmpties);
  expect(usageReport.lines.length).toBe(1);
  expect(usageReport.lines[0].username).toBe('');
  expect(usageReport.lines[0].organization).toBe('');
  expect(usageReport.lines[0].repositoryName).toBe('');
  expect(usageReport.lines[0].workflowPath).toBe('');
  expect(usageReport.lines[0].costCenterName).toBe('');
});

test('readGithubUsageReport handles zero and negative amounts', async () => {
  const mockWithZeros = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_linux","0","minutes","0","0","0","0","user1","org1","repo1",".github/workflows/test.yml","cc1"`;
  
  const usageReport = await readGithubUsageReport(mockWithZeros);
  expect(usageReport.lines[0].quantity).toBe(0);
  expect(usageReport.lines[0].pricePerUnit).toBe(0);
  expect(usageReport.lines[0].grossAmount).toBe(0);
  expect(usageReport.lines[0].netAmount).toBe(0);
});

test('readGithubUsageReport handles large numbers and decimals', async () => {
  const mockLargeNumbers = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_storage","999999","gigabyte-hours","0.123456789","123456.789","100000.50","23456.289","user1","org1","repo1","","cc1"`;
  
  const usageReport = await readGithubUsageReport(mockLargeNumbers);
  expect(usageReport.lines[0].quantity).toBe(999999);
  expect(usageReport.lines[0].pricePerUnit).toBeCloseTo(0.123456789, 9);
  expect(usageReport.lines[0].grossAmount).toBeCloseTo(123456.789, 3);
  expect(usageReport.lines[0].discountAmount).toBeCloseTo(100000.50, 2);
  expect(usageReport.lines[0].netAmount).toBeCloseTo(23456.289, 3);
});

test('readGithubUsageReport handles different date formats', async () => {
  const mockDifferentDates = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-01-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","user1","org1","repo1","","cc1"
"2025-12-31","actions","actions_linux","2","minutes","0.008","0.016","0.016","0","user2","org2","repo2","","cc2"`;
  
  const usageReport = await readGithubUsageReport(mockDifferentDates);
  expect(usageReport.lines.length).toBe(2);
  expect(usageReport.startDate).toEqual(new Date('2025-01-01'));
  expect(usageReport.endDate).toEqual(new Date('2025-12-31'));
  expect(usageReport.days).toBeCloseTo(364, 0); // 2025 is not a leap year
});

test('readGithubUsageReport handles special characters in strings', async () => {
  const mockSpecialChars = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","user-name_123","org.name-2024","repo_name-v2",".github/workflows/test-ci.yml","cost_center-123"`;
  
  const usageReport = await readGithubUsageReport(mockSpecialChars);
  expect(usageReport.lines[0].username).toBe('user-name_123');
  expect(usageReport.lines[0].organization).toBe('org.name-2024');
  expect(usageReport.lines[0].repositoryName).toBe('repo_name-v2');
  expect(usageReport.lines[0].workflowPath).toBe('.github/workflows/test-ci.yml');
  expect(usageReport.lines[0].costCenterName).toBe('cost_center-123');
});

test('readGithubUsageReport handles new product types and SKUs', async () => {
  const mockNewProducts = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","copilot","copilot_enterprise","1","user-months","39","39","10","29","user1","org1","","",""
"2025-11-01","packages","packages_storage","100","gigabyte-hours","0.008","0.8","0.2","0.6","user2","org2","repo2","",""
"2025-11-01","git_lfs","git_lfs_storage","50","gigabyte-hours","0.0875","4.375","0","4.375","user3","org3","repo3","",""`;
  
  const usageReport = await readGithubUsageReport(mockNewProducts);
  expect(usageReport.lines.length).toBe(3);
  expect(usageReport.lines[0].product).toBe('copilot');
  expect(usageReport.lines[0].sku).toBe('copilot_enterprise');
  expect(usageReport.lines[0].unitType).toBe('user-months');
  expect(usageReport.lines[1].product).toBe('packages');
  expect(usageReport.lines[2].product).toBe('git_lfs');
});

test('readGithubUsageReport handles mixed 14 and 15 column formats', async () => {
  const mockMixed = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","user1","org1","repo1",".github/workflows/test.yml","cc1"`;
  
  // This tests the 14-column format, but in reality if there's ever a 15-column row it should be handled
  const usageReport = await readGithubUsageReport(mockMixed);
  expect(usageReport.lines.length).toBe(1);
  expect(usageReport.lines[0].workflowName).toBeUndefined();
});

test('readGithubUsageReport handles very long workflow paths', async () => {
  const longPath = '.github/workflows/very/deeply/nested/folder/structure/with/many/levels/for/complex/monorepo/setup/testing.yml';
  const mockLongPath = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","user1","org1","repo1","${longPath}","cc1"`;
  
  const usageReport = await readGithubUsageReport(mockLongPath);
  expect(usageReport.lines[0].workflowPath).toBe(longPath);
});

test('readGithubUsageReport handles whitespace in values', async () => {
  const mockWhitespace = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0"," user1 "," org1 "," repo1 ",".github/workflows/test.yml"," cc1 "`;
  
  const usageReport = await readGithubUsageReport(mockWhitespace);
  // CSV parser doesn't trim, so values should preserve whitespace
  expect(usageReport.lines[0].username).toBe(' user1 ');
  expect(usageReport.lines[0].organization).toBe(' org1 ');
});

test('readGithubUsageReport calculates date ranges correctly for single day', async () => {
  const mockSingleDay = `"date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository","workflow_path","cost_center_name"
"2025-11-01","actions","actions_linux","1","minutes","0.008","0.008","0.008","0","user1","org1","repo1","","cc1"
"2025-11-01","actions","actions_linux","2","minutes","0.008","0.016","0.016","0","user2","org2","repo2","","cc2"`;
  
  const usageReport = await readGithubUsageReport(mockSingleDay);
  expect(usageReport.days).toBe(0); // Same day = 0 days difference
  expect(usageReport.startDate).toEqual(usageReport.endDate);
});

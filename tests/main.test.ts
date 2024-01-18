import { test, expect } from '@jest/globals';
import { readGithubUsageReport } from '../src/index';

test('Read a Github usage report csv file and return a JSON object', async () => {
  const usageReport = await readGithubUsageReport(
    './tests/data/github-usage-report.csv'
  );
  expect(usageReport.lines[0]).toEqual({
    date: new Date('2023-06-03'),
    product: 'Actions',
    sku: 'Compute - UBUNTU',
    quantity: 1,
    unitType: 'minute',
    pricePerUnit: 0.008,
    multiplier: 1.0,
    owner: 'octodemo-orchestration-testing',
    repositorySlug: 'demo-bootstrap',
    username: 'peter-murray',
    actionsWorkflow: '.github/workflows/maintenance_review_demo_states.yml',
    notes: '',
  });
  expect(usageReport.lines.length).toEqual(117695);
  expect(usageReport.days).toEqual(180);
  expect(usageReport.startDate).toEqual(new Date('2023-06-03'));
  expect(usageReport.endDate).toEqual(new Date('2023-11-30'));
}, 600000);
import { test, expect } from '@jest/globals';
import { readGithubUsageReportFile, readGithubUsageReportFileSync } from '../src/index';
import { readGithubUsageReport } from '../src/usage-report';

test('readGithubUsageReport works', async () => {
  const usageReport = await readGithubUsageReport(
    `date,product,sku,quantity,unit-type,price-per-unit,multiplier,owner,repository-slug,username,actions-workflow,notes
2023-06-03,Actions,Compute - UBUNTU,1,minute,0.008,1.0,octodemo-orchestration-testing,demo-bootstrap,peter-murray,.github/workflows/maintenance_review_demo_states.yml,
2023-06-03,Actions,Compute - UBUNTU,1,minute,0.008,1.0,octodemo-orchestration-testing,demo-bootstrap,peter-murray,.github/workflows/maintenance_review_demo_states.yml,`,
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
}, 600000);

test('readGithubUsageReportFile works', async () => {
  const usageReport = await readGithubUsageReportFile(
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
}
  , 600000);

test('readGithubUsageReportFileSync works', async () => {
  const usageReport = await readGithubUsageReportFileSync(
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
});

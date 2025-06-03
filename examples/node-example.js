// Example usage for Node.js environments
import { readGithubUsageReportFile, readGithubUsageReportFileSync } from '../dist/node.js';

async function nodeExample() {
  try {
    console.log('=== Async File Reading ===');
    const report = await readGithubUsageReportFile('./tests/data/usageReport_1_0b650fc20d564ed2bddf337ac27c7a57.csv', (line) => {
      console.log(`${line.date.toLocaleDateString()} - ${line.product}\t$${line.netAmount.toFixed(2)}`);
    });
    
    console.log(`\nTotal usage: $${report.lines.reduce((sum, line) => sum + line.netAmount, 0).toFixed(2)}`);
    
    console.log('\n=== Sync File Reading ===');
    const syncReport = await readGithubUsageReportFileSync('./tests/data/usageReport_1_0b650fc20d564ed2bddf337ac27c7a57.csv');
    console.log(`Sync read complete: ${syncReport.lines.length} lines processed`);
    
  } catch (error) {
    console.error('Error reading usage report:', error);
  }
}

nodeExample();

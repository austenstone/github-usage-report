const { readModelUsageReport } = require('../dist/usage-report');
const fs = require('fs');

// Example CSV data for model usage report (similar to premium_interactions_b16336c228824bf39744429a39994e16.csv)
const csvData = `Timestamp,User,Model,Requests Used,Exceeds Monthly Quota,Total Monthly Quota
2025-06-02T22:34:09Z,bspann,claude-sonnet-4,1.00,false,Unlimited
2025-06-02T19:19:05Z,bspann,claude-sonnet-4,1.00,false,Unlimited
2025-06-02T18:57:29Z,bspann,claude-sonnet-4,1.00,false,Unlimited
2025-06-02T05:42:25Z,bspann,claude-sonnet-4,1.00,false,Unlimited`;

async function example() {
  try {
    const report = await readModelUsageReport(csvData);
    
    console.log('Model Usage Report Summary:');
    console.log(`Period: ${report.startDate.toISOString()} to ${report.endDate.toISOString()}`);
    console.log(`Duration: ${report.days} days`);
    console.log(`Total entries: ${report.lines.length}`);
    console.log();
    
    console.log('Usage details:');
    report.lines.forEach((line, index) => {
      console.log(`${index + 1}. ${line.user} used ${line.model} - ${line.requestsUsed} requests`);
      console.log(`   Quota: ${line.totalMonthlyQuota}, Exceeds: ${line.exceedsMonthlyQuota}`);
      console.log(`   Timestamp: ${line.timestamp.toISOString()}`);
      console.log();
    });
      // Find users who exceeded quota
    const exceededQuota = report.lines.filter(line => line.exceedsMonthlyQuota);
    if (exceededQuota.length > 0) {
      console.log('Users who exceeded quota:');
      exceededQuota.forEach(line => {
        console.log(`- ${line.user} (${line.model})`);
      });
    } else {
      console.log('No users exceeded their quota.');
    }
    
  } catch (error) {
    console.error('Error parsing model usage report:', error);
  }
}

example();

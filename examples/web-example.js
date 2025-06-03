// Example usage for web environments
import { readGithubUsageReport } from "github-usage-report";

// Simulate CSV data that might come from a file upload or API
const csvData = `"formatted_date","product","sku","quantity","unit_type","applied_cost_per_quantity","gross_amount","discount_amount","net_amount","username","organization","repository_name","workflow_name","workflow_path","cost_center_name"
"2025-05-01","actions","actions_linux","100","minutes","0.008","0.8","0","0.8","user1","myorg","repo1","CI",".github/workflows/ci.yml","development"
"2025-05-02","actions","actions_linux","150","minutes","0.008","1.2","0.2","1.0","user2","myorg","repo2","Deploy",".github/workflows/deploy.yml","production"`;

async function example() {
  try {
    const report = await readGithubUsageReport(csvData);
    
    console.log('=== GitHub Usage Report ===');
    console.log(`Report period: ${report.startDate.toDateString()} to ${report.endDate.toDateString()}`);
    console.log(`Total days: ${report.days}`);
    console.log(`Total usage lines: ${report.lines.length}`);
    
    console.log('\n=== Usage Details ===');
    report.lines.forEach(line => {
      console.log(`${line.date.toDateString()}: ${line.product} - ${line.quantity} ${line.unitType} ($${line.netAmount}) - ${line.workflowName}`);
    });
    
    // Calculate total cost
    const totalCost = report.lines.reduce((sum, line) => sum + line.netAmount, 0);
    console.log(`\nTotal cost: $${totalCost.toFixed(2)}`);
  } catch (error) {
    console.error('Error parsing usage report:', error);
  }
}

example();

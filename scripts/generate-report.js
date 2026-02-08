const fs = require('fs');
const path = require('path');

function generateReport() {
  const historyPath = path.resolve(__dirname, '../history/execution-history.json');
  if (!fs.existsSync(historyPath)) {
    console.error('No execution-history.json found. Run tests first.');
    return;
  }
  const data = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));
  let passCount = 0;
  let failCount = 0;
  data.forEach((entry) => {
    if (entry.status === 'passed') passCount++; else failCount++;
  });
  const tableRows = data.map(entry => {
    const evidenceLink = entry.screenshotPath ? `<a href="../${path.relative(path.resolve(__dirname, '..'), entry.screenshotPath).replace(/\\/g, '/')}">View</a>` : '';
    return `<tr>
      <td>${entry.testName}</td>
      <td class="${entry.status}">${entry.status}</td>
      <td>${(entry.duration / 1000).toFixed(2)}s</td>
      <td>${entry.timestamp}</td>
      <td>${evidenceLink}</td>
    </tr>`;
  }).join('\n');
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Execution Report</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
    th { background-color: #f2f2f2; }
    .passed { color: green; }
    .failed { color: red; }
  </style>
</head>
<body>
  <h1>Execution History Report</h1>
  <p>Total Passed: <span class="passed">${passCount}</span>, Total Failed: <span class="failed">${failCount}</span></p>
  <table>
    <thead>
      <tr>
        <th>Test Name</th>
        <th>Status</th>
        <th>Duration</th>
        <th>Timestamp</th>
        <th>Evidence</th>
      </tr>
    </thead>
    <tbody>
      ${tableRows}
    </tbody>
  </table>
</body>
</html>`;
  const outputDir = path.resolve(__dirname, '../reports');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'summary.html'), html);
  console.log('Report generated at reports/summary.html');
}

generateReport();

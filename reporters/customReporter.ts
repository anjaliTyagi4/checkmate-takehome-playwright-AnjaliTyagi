import type { Reporter, TestCase, TestResult, Suite, FullConfig } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

interface HistoryEntry {
  testName: string;
  status: string;
  duration: number;
  timestamp: string;
  screenshotPath?: string;
}

class CustomReporter implements Reporter {
  private historyPath: string;

  constructor() {
    this.historyPath = path.resolve(__dirname, '../history/execution-history.json');
  }

  onBegin(config: FullConfig, suite: Suite) {
    if (!fs.existsSync(this.historyPath)) {
      fs.mkdirSync(path.dirname(this.historyPath), { recursive: true });
      fs.writeFileSync(this.historyPath, '[]', { encoding: 'utf-8' });
    }
  }

  async onTestEnd(test: TestCase, result: TestResult) {
    const entry: HistoryEntry = {
      testName: test.titlePath().join(' > '),
      status: result.status,
      duration: result.duration,
      timestamp: new Date().toISOString()
    };
    const attachments = result.attachments || [];
    for (const att of attachments) {
      if (att.name === 'screenshot' && att.path) {
        entry.screenshotPath = att.path;
        break;
      }
    }
    const historyRaw = fs.readFileSync(this.historyPath, 'utf-8');
    const history = JSON.parse(historyRaw) as HistoryEntry[];
    history.push(entry);
    fs.writeFileSync(this.historyPath, JSON.stringify(history, null, 2));
  }
}

export default CustomReporter;

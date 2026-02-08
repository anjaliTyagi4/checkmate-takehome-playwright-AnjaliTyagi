import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';

test('Test Case 5: No results state', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();
  // Apply a combination that yields no results: e.g., Java + Advanced + 50,000+
  await tablePage.selectLanguage('Java');
  await tablePage.setLevel(false, false, true);
  await tablePage.selectMinEnrollments(50000);

  await expect(tablePage.noDataText).toBeVisible();
   console.log('No results state triggered successfully');
  console.log('Verified: "No matching courses." message is visible');
  await page.screenshot({ path: `reports/screenshots/test5-no-results-${Date.now()}.png` });
});

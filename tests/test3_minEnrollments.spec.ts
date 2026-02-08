import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';

test('Test Case 3: Min enrollments → 10,000+', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();
  await tablePage.selectMinEnrollments(10000);
  const courses = await tablePage.getCourseData();

  // ✅ Console proof
  await test.step('Log extracted courses after Min Enrollments filter', async () => {
    console.log(
      `Extracted ${courses.length} rows after applying Min Enrollments ≥ 10,000`
    );

    courses.forEach((c, index) => {
      console.log(
        `[${index + 1}] ID=${c.id} | ${c.name} | ${c.language} | ${c.level} | ${c.enrollments}`
      );
    });
  });

  for (const c of courses) {
    expect(Number(c.enrollments)).toBeGreaterThanOrEqual(10000);
  }
  await page.locator('#courses_table').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `reports/screenshots/test3-min-enroll-${Date.now()}.png` });
});

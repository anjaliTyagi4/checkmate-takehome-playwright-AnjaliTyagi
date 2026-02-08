import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';

test('Test Case 2: Level filter → Beginner only', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();

  // Apply filter: Beginner only
  await tablePage.setLevel(true, false, false);
  const courses = await tablePage.getCourseData();

  console.log(`Beginner filter applied → ${courses.length} rows`);

  courses.forEach((c, index) => {
    console.log(
      `[${index + 1}] ID=${c.id} | ${c.name} | ${c.language} | ${c.level} | ${c.enrollments}`
    );


    // Positive + negative validation
    expect(c.level).toBe('Beginner');
    expect(c.level).not.toBe('Intermediate');
    expect(c.level).not.toBe('Advanced');
  });

  await page.locator('#courses_table').scrollIntoViewIfNeeded();
  await page.screenshot({
    path: `reports/screenshots/test2-level-filter-${Date.now()}.png`,
  });
});

import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';

test('Test Case 4: Combined filters → Python + Beginner + 10,000+', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();
  await tablePage.selectLanguage('Python');
  await tablePage.setLevel(true, false, false);
  await tablePage.selectMinEnrollments(10000);
  const courses = await tablePage.getCourseData();

  // ✅ Console proof
  await test.step('Log extracted courses after combined filters', async () => {
    console.log(
      `Extracted ${courses.length} rows after applying Python + Beginner + 10,000+`
    );

    courses.forEach((c, index) => {
      console.log(
        `[${index + 1}] ID=${c.id} | ${c.name} | ${c.language} | ${c.level} | ${c.enrollments}`
      );
    });
  });


  for (const c of courses) {
    expect(c.language).toBe('Python');
    expect(c.level).toBe('Beginner');
    expect(Number(c.enrollments)).toBeGreaterThanOrEqual(10000);
  }
  await page.screenshot({ path: `reports/screenshots/test4-combined-${Date.now()}.png` });
});

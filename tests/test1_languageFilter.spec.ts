import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';

test('Test Case 1: Language filter → Java', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();

  // Apply Java
  await tablePage.selectLanguage('Java');
  let courses = await tablePage.getCourseData();

  console.log(`Java applied → ${courses.length} rows`);
  courses.forEach(c => expect(c.language).toBe('Java'));

   // ✅ Console proof that table data was extracted
await test.step('Log extracted course rows', async () => {
  console.log(`Extracted ${courses.length} rows after applying Language = Java`);

  courses.forEach((c, index) => {
    console.log(
      `[${index + 1}] ID=${c.id} | ${c.name} | ${c.language} | ${c.level} | ${c.enrollments}`
    );
  });
});


  // Change filter
  await tablePage.selectLanguage('Python');

  // Re-apply Java (validates refresh/reapply)
  await tablePage.selectLanguage('Java');
  courses = await tablePage.getCourseData();

  console.log(`Java re-applied → ${courses.length} rows`);
  courses.forEach(c => expect(c.language).toBe('Java'));

  await page.screenshot({
    path: `reports/screenshots/test1-language-filter-${Date.now()}.png`,
  });
});

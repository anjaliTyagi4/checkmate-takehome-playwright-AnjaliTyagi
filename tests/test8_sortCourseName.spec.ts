import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';

test('Test Case 8: Sort by Course Name (alphabetical)', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();
  await tablePage.selectSortBy('col_course');
  const courses = await tablePage.getCourseData();

   console.log(`Extracted ${courses.length} rows after sorting by Course Name`);

  // Log rows in displayed order
  courses.forEach((c, index) => {
    console.log(
      `[${index + 1}] ID=${c.id} | Course="${c.name}" | Language=${c.language} | Level=${c.level}`
    );
  });


  const names = courses.map(c => c.name.trim().toLowerCase());
  const sortedNames = [...names].sort((a,b) => a.localeCompare(b));

  expect(names).toEqual(sortedNames);
  await page.screenshot({ path: `reports/screenshots/test8-sort-name-${Date.now()}.png` });
});

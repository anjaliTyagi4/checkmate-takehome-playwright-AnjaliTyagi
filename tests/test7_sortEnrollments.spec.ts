import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';

test('Test Case 7: Sort by Enrollments (ascending, numeric)', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();
  console.log('Selecting Sort By → Enrollments (ascending)');
  await tablePage.selectSortBy('col_enroll');
  const courses = await tablePage.getCourseData();
  console.log(`Extracted ${courses.length} rows after sorting by Enrollments`);

  // Log each row in order
  courses.forEach((c, index) => {
    console.log(
      `[${index + 1}] ID=${c.id} | ${c.name} | Enrollments=${c.enrollments}`
    );
  });

  const enrollmentsList = courses.map(c => c.enrollments);
  const sortedCopy = [...enrollmentsList].sort((a,b) => a - b);

  expect(enrollmentsList).toEqual(sortedCopy);

  await page.locator('#courses_table').scrollIntoViewIfNeeded();
  await page.screenshot({ path: `reports/screenshots/test7-sort-enroll-${Date.now()}.png` });
});

import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';


test('Test Case 9: Default view displays all courses', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();

  // Language default = Any (radio)
  expect(await tablePage.languageRadio('Any').isChecked()).toBe(true);

  // Level defaults = all checked
  expect(await tablePage.levelBeginner.isChecked()).toBe(true);
  expect(await tablePage.levelIntermediate.isChecked()).toBe(true);
  expect(await tablePage.levelAdvanced.isChecked()).toBe(true);

  // Courses visible
  const courses = await tablePage.getCourseData();
  expect(courses.length).toBeGreaterThanOrEqual(9);

  await page.screenshot({
    path: `reports/screenshots/test9-default-view-${Date.now()}.png`,
  });
});


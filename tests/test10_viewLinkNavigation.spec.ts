import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';

test('Test Case 10: View link opens correct course page', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();
  const courses = await tablePage.getCourseData();
   console.log(`Total courses loaded in table: ${courses.length}`);
  const firstCourse = courses[0];
  console.log(
    `Using course → ID=${firstCourse.id} | Name="${firstCourse.name}" | ViewLink=${firstCourse.viewHref}`
  );
  const viewLink = tablePage.page.locator(`a[href="${firstCourse.viewHref}"]`).first();
  await viewLink.click();
   console.log('Clicking View link...');
  await viewLink.click();
  await page.waitForLoadState('domcontentloaded');
  const content = await page.textContent('body');
  console.log(
    `Navigated page contains course name:`,
    content?.toLowerCase().includes(firstCourse.name.toLowerCase())
  );
  expect(content?.toLowerCase()).toContain(firstCourse.name.toLowerCase());
  await page.screenshot({ path: `reports/screenshots/test10-view-link-${Date.now()}.png` });
});

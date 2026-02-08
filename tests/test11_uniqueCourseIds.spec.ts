import { test, expect } from '@playwright/test';
import { CourseTablePage } from '../src/pages/courseTablePage';

test('Verify all course IDs are unique', async ({ page }) => {
  const tablePage = new CourseTablePage(page);
  await tablePage.goto();

  // Fetch course data
  const courses = await tablePage.getCourseData();

  // Defensive check
  expect(courses.length).toBeGreaterThan(0);

  console.log(`Total courses extracted: ${courses.length}`);

  // Extract IDs
  const ids = courses.map(course => course.id); 
   console.log('Extracted Course IDs from table:');
  ids.forEach((id, index) => {
    console.log(`[${index + 1}] Course ID = ${id}`);
  });
  // ⬆️ Replace `course.name` with `course.id` if ID column exists separately

  // Find duplicates
  const uniqueIds = new Set(ids);
  console.log(`Unique ID count: ${uniqueIds.size}`);
  console.log(`Total ID count : ${ids.length}`);

  // Assertion
  expect(uniqueIds.size).toBe(ids.length);

  // Optional: better error message
  if (uniqueIds.size !== ids.length) {
    const duplicates = ids.filter(
      (id, index) => ids.indexOf(id) !== index
    );
    console.error(
      '❌ Duplicate Course IDs found:',
      [...new Set(duplicates)]
    );

    throw new Error(`Duplicate course IDs found: ${[...new Set(duplicates)].join(', ')}`);
  }

   console.log('✅ All course IDs are unique');
   await page.locator('#courses_table').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `reports/screenshots/test11-unique-CourseIds-${Date.now()}.png` });

});

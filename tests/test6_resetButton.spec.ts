  import { test, expect } from '@playwright/test';
  import { CourseTablePage } from '../src/pages/courseTablePage';

  test('Test Case 6: Reset button visibility and behavior', async ({ page }) => {
    const tablePage = new CourseTablePage(page);
    await tablePage.goto();

    // Apply a filter
    await tablePage.selectLanguage('Python');
    expect(await tablePage.isResetVisible()).toBe(true);

    // Reset
    await tablePage.resetFilters();

    // Reset button hidden
    expect(await tablePage.isResetVisible()).toBe(false);

    // Default states
    expect(await tablePage.languageRadio('Any').isChecked()).toBe(true);
    expect(await tablePage.levelBeginner.isChecked()).toBe(true);
    expect(await tablePage.levelIntermediate.isChecked()).toBe(true);
    expect(await tablePage.levelAdvanced.isChecked()).toBe(true);

    // Data exists (no strict row count)
    const courses = await tablePage.getCourseData();
    expect(courses.length).toBeGreaterThan(0);

    
  });

import { Page, Locator, expect } from '@playwright/test';

export class CourseTablePage {
  readonly page: Page;

  // Language radios (dynamic)
  readonly languageRadio: (value: string) => Locator;

  // Level checkboxes
  readonly levelBeginner: Locator;
  readonly levelIntermediate: Locator;
  readonly levelAdvanced: Locator;

  // Reset & No-data
  readonly resetButton: Locator;
  readonly noDataText: Locator;

  // Enrollments (custom dropdown)
  readonly enrollDropdownButton: Locator;
  readonly enrollOption: (value: string) => Locator;

  // Sort
  readonly sortBySelect: Locator;

  constructor(page: Page) {
    this.page = page;

    // Language radios
    this.languageRadio = (value: string) =>
      this.page.locator(`input[type="radio"][name="lang"][value="${value}"]`);

    // Level checkboxes
    this.levelBeginner = this.page.locator(`input[name="level"][value="Beginner"]`);
    this.levelIntermediate = this.page.locator(`input[name="level"][value="Intermediate"]`);
    this.levelAdvanced = this.page.locator(`input[name="level"][value="Advanced"]`);

    // Reset & no-data
    this.resetButton = this.page.locator('#resetFilters');
    this.noDataText = this.page.locator('#noData');

    // Enrollments dropdown
    this.enrollDropdownButton = this.page.locator('#enrollDropdown .dropdown-button');
    this.enrollOption = (value: string) =>
      this.page.locator(`#enrollDropdown .dropdown-menu li[data-value="${value}"]`);

    // Sort
    this.sortBySelect = this.page.locator('#sortBy');
  }

  /* ---------------- Navigation ---------------- */

  async goto() {
    await this.page.goto(
      'https://practicetestautomation.com/practice-test-table/'
    );
  }

  /* ---------------- Reset ---------------- */

  async isResetVisible(): Promise<boolean> {
    return await this.resetButton.isVisible();
  }

  async resetFilters() {
    await this.resetButton.click();

    // Wait for default state instead of table rows
    await expect(this.languageRadio('Any')).toBeChecked();
    await expect(this.levelBeginner).toBeChecked();
    await expect(this.levelIntermediate).toBeChecked();
    await expect(this.levelAdvanced).toBeChecked();
  }

  /* ---------------- Filters ---------------- */

  async selectLanguage(value: string) {
    const radio = this.languageRadio(value);
    await radio.waitFor({ state: 'visible' });
    await radio.check();
    await this.waitForTableToLoad();
  }

  async setLevel(beginner: boolean, intermediate: boolean, advanced: boolean) {
    await this.levelBeginner.waitFor({ state: 'visible' });

    beginner ? await this.levelBeginner.check() : await this.levelBeginner.uncheck();
    intermediate
      ? await this.levelIntermediate.check()
      : await this.levelIntermediate.uncheck();
    advanced ? await this.levelAdvanced.check() : await this.levelAdvanced.uncheck();

    await this.waitForTableToLoad();
  }

  async selectMinEnrollments(value: number | 'any') {
    await this.enrollDropdownButton.click();

    const dataValue = value === 'any' ? 'any' : String(value);
    const option = this.enrollOption(dataValue);

    await option.waitFor({ state: 'visible' });
    await option.click();
    await this.waitForTableToLoad();
  }

  async getAllCourseIds(): Promise<string[]> {
  const courses = await this.getCourseData();
  return courses.map(course => course.id);
}
  async selectSortBy(value: 'col_enroll' | 'col_course') {
    await this.sortBySelect.waitFor({ state: 'visible' });
    await this.sortBySelect.selectOption(value);
    await this.waitForTableToLoad();
  }

  /* ---------------- Table wait ---------------- */

  async waitForTableToLoad() {
    // If "No Data" is visible, exit immediately
  if (await this.noDataText.isVisible()) {
    return;
  }
    const visibleRows = this.page.locator(
      '#courses_table tbody tr:not([style*="display: none"])'
    );

    // Either rows OR no-data is acceptable
    await Promise.race([
      visibleRows.first().waitFor({ state: 'visible' }).catch(() => {}),
      this.noDataText.waitFor({ state: 'visible' }).catch(() => {}),
    ]);
  }

  /* ---------------- Data extraction ---------------- */

  async getCourseData() {
    await this.waitForTableToLoad();

    const rows = this.page.locator(
      '#courses_table tbody tr:not([style*="display: none"])'
    );

    const rowCount = await rows.count();
    const data: {
      id: string;
      name: string;
      language: string;
      level: string;
      enrollments: number;
      viewHref: string;
    }[] = [];

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);

      const id = (await row.locator('td').nth(0).innerText()).trim();

      const name = (await row.locator('td[data-col="course"]').innerText()).trim();
      const language = (await row.locator('td[data-col="language"]').innerText()).trim();
      const level = (await row.locator('td[data-col="level"]').innerText()).trim();

      const enrollmentsText = await row
        .locator('td[data-col="enrollments"]')
        .innerText();
      const enrollments = Number(enrollmentsText.replace(/,/g, '').trim());

      const viewHref =
        (await row.locator('td[data-col="link"] a').getAttribute('href')) ?? '';

      data.push({id, name, language, level, enrollments, viewHref });
    }

    return data;
  }
}

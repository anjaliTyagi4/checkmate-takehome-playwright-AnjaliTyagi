# Practice Test Automation Table - Playwright Framework

This project contains an end-to-end Playwright automation framework for validating the filtering and sorting functionality of the [Practice Test Automation table](https://practicetestautomation.com/practice-test-table/). The framework uses TypeScript, the Page Object Model (POM), a custom reporter for historical run tracking, and a report generator script that produces an HTML summary.

## Prerequisites

- [Node.js](https://nodejs.org/) v14+ installed on your machine.
- Internet access for downloading project dependencies.

## Setup

1. Clone or download this repository.
2. Navigate to the project directory and install dependencies:

   ```bash
   npm install
   ```

3. To run the test suite in parallel:

   ```bash
   npm run test:parallel
   ```

   To run the test suite sequentially:

   ```bash
   npm run test:sequential
   ```

   Both commands will execute all test cases using the custom reporter. Screenshots will be saved automatically on test completion in the `reports/screenshots` directory.

4. Generate the historical execution report:

   ```bash
   npm run report:generate
   ```

   This will read the `execution-history.json` file and create an HTML summary at `reports/summary.html` showing pass/fail counts and evidence links.

## Project Structure

- **playwright.config.ts** – Configuration file specifying the test directory, reporter, and default options. Two npm scripts control worker count for parallel/sequential runs.
- **src/pages/courseTablePage.ts** – Page Object Model (POM) class encapsulating locators and actions on the target table page.
- **tests/** – Contains individual test files for each test case.
- **reporters/customReporter.ts** – Implements a Playwright reporter that appends test results (name, status, duration, timestamp, screenshot path) to `execution-history.json`.
- **scripts/generate-report.js** – Node script to generate a standalone HTML report summarizing all runs and linking to captured screenshots.
- **history/execution-history.json** – Auto-generated file persisting historical test results.
- **reports/** – Contains generated HTML reports and captured screenshots.

## Test Cases Implemented

Eight test cases are based on the scenarios described on the practice site, plus three additional tests:

1. **Language filter → Java** – Verifies only Java courses are visible when filtering by language.
2. **Level filter → Beginner only** – Verifies only Beginner courses are visible when Intermediate and Advanced options are unchecked.
3. **Min enrollments → 10,000+** – Ensures all visible courses have enrollments ≥ 10,000.
4. **Combined filters → Python + Beginner + 10,000+** – Applies multiple filters and verifies the result set.
5. **No results state** – Asserts the “No matching courses.” message appears for a filter combination that yields no results.
6. **Reset button visibility and behavior** – Checks the Reset button appears after a filter change and restores defaults when clicked.
7. **Sort by Enrollments (ascending)** – Confirms sorting on the Enrollments column orders rows numerically.
8. **Sort by Course Name (alphabetical)** – Confirms sorting on the Course Name column orders rows alphabetically.
9. **Default view displays all courses (additional)** – Validates that the default state shows all courses with default filter values.
10. **View link opens correct course page (additional)** – Ensures that clicking a course’s View link navigates to a page containing the course name.
11. **Unique course ID validation (additional)** – Verifies that all courses displayed in the table have unique course IDs, ensuring data integrity and preventing duplicate entries.

Feel free to extend the framework with additional test cases or custom utility scripts.


How to run now
Parallel: npm run test:parallel
Sequential: npm run test:sequential
Single test: npx playwright test tests/test_name_.spec.ts

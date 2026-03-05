import { test, expect } from "@playwright/test";

test.describe("Layout stats box", () => {
  test("shows layout stats after adding a table", async ({ page }) => {
    await page.goto("/editor/templates/blank");

    // Initially, no stats box should be visible for an empty diagram
    await expect(page.getByText("Layout stats")).toHaveCount(0);

    // Add a table via the toolbar button
    const addTableButton = page.getByRole("button", { name: /add table/i });
    await addTableButton.click();

    // Stats box should now appear with basic labels
    await expect(page.getByText("Layout stats")).toBeVisible();
    await expect(page.getByText("Tables")).toBeVisible();
    await expect(page.getByText("Relationships")).toBeVisible();
  });

  test("updates table count when multiple tables are added", async ({ page }) => {
    await page.goto("/editor/templates/blank");

    const addTableButton = page.getByRole("button", { name: /add table/i });
    await addTableButton.click();
    await addTableButton.click();

    const statsBox = page.getByText("Layout stats");
    await expect(statsBox).toBeVisible();

    // We expect the "Tables" row to eventually include the number 2
    const tablesRow = page
      .locator("text=Tables")
      .locator("xpath=.."); // parent flex row
    await expect(tablesRow).toContainText("2");
  });
});


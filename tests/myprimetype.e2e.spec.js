import { test, expect } from "@playwright/test";

test.describe("MYPRIMETYPE datatype", () => {
  test("appears in field type dropdown for Generic diagrams", async ({ page }) => {
    await page.goto("/editor/templates/blank");

    // Ensure the editor UI is loaded
    await expect(page.getByRole("navigation")).toBeVisible();

    // Add a new table so we have a field row rendered for sure
    const addTableButton = page.getByRole("button", { name: /add table/i });
    await addTableButton.click();

    // Open the first field type dropdown (placeholder 'type' from i18n)
    const typeSelect = page.getByPlaceholder(/type/i).first();
    await typeSelect.click();

    // Expect MYPRIMETYPE to be one of the available options
    await expect(
      page.getByRole("option", { name: "MYPRIMETYPE" }),
    ).toBeVisible();
  });
});


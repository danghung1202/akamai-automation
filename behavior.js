const puppeteer = require('puppeteer');
const akamaiMenu = require('./menu');
const log = require('./log');


module.exports = {
    /**
     * Checks if a behavior with the given name exists on the page.
     * 
     * @param {puppeteer.Page} page - The Puppeteer page instance.
     * @param {string} behaviorName - The name of the behavior to check.
     * @returns {Promise<boolean>} - Returns true if the behavior exists, otherwise false.
     */
    checkHasBehaviorByName: async (page, behaviorName) => {
        const xpathHeader = `//pm-rule-editor/pm-behavior-list//pm-behavior[div[@class="header" and contains(string(), "${behaviorName}")]]`
        if (await page.$('xpath=' + xpathHeader)) {
            return true;
        }
        return false;
    },

    /**
     * Adds a new behavior with the given name to the page.
     * 
     * @param {puppeteer.Page} page - The Puppeteer page instance.
     * @param {string} behaviorName - The name of the behavior to add.
     * @returns {Promise<void>}
     */
    addNewBehavior: async (page, behaviorName) => {
        const xpathBtn = `//pm-rule-editor/pm-behavior-list//akam-content-panel-header[contains(string(), "Behaviors")]//button`
        await page.locator('xpath=' + xpathBtn)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to '+Behavior' button to add new behavior`)
            }).click()

        await akamaiMenu.clickToMenuItemInAkamMenu(page, "Standard property behavior")

        const selectedRule = `//pm-add-behavior-modal//div[@class="add-behavior-modal-sidebar-body"]//ul/li[contains(text(), "${behaviorName}")]`
        await page.locator('xpath=' + selectedRule)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Select  the '${behaviorName}' from behavior template`)
            }).click();

        const insertBtn = `//div[@akammodalactions]/button[contains(text(), "Insert Behavior")]`
        await page.locator('xpath=' + insertBtn)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to 'Insert Behavior' to save new behavior`)
            }).click();

    },

    /**
     * Gets the value of an input field within a behavior.
     * 
     * @param {puppeteer.Page} page - The Puppeteer page instance.
     * @param {string} behaviorName - The name of the behavior.
     * @param {string} fieldLabel - The label of the input field.
     * @param {number} [index=1] - The index of the behavior if there are multiple with the same name.
     * @returns {Promise<string>} - The value of the input field.
     */
    getValueOfInputFieldInBehavior: async (page, behaviorName, fieldLabel, index = 1) => {
        const xpathInput = `//pm-rule-editor/pm-behavior-list//pm-behavior[div[@class="header" and contains(string(), "${behaviorName}")]][${index}]//div[akam-form-label[contains(string(), "${fieldLabel}")]]/following-sibling::div`
        await page.locator('xpath=' + xpathInput).wait()
        return await page.$eval('xpath=' + xpathInput, el => el.innerText)
    },

    /**
     * Updates the value of an input field within a behavior.
     * 
     * @param {puppeteer.Page} page - The Puppeteer page instance.
     * @param {string} behaviorName - The name of the behavior.
     * @param {string} fieldLabel - The label of the input field.
     * @param {string} fieldValue - The value to set for the input field.
     * @param {number} [index=1] - The index of the behavior if there are multiple with the same name.
     * @returns {Promise<void>}
     */
    updateValueForInputFieldInBehavior: async (page, behaviorName, fieldLabel, fieldValue, index = 1) => {
        const xpathInput = `//pm-rule-editor/pm-behavior-list//pm-behavior[div[@class="header" and contains(string(), "${behaviorName}")]][${index}]//div[akam-form-label[contains(string(), "${fieldLabel}")]]/following-sibling::div//input[@type="text"]`
        await page.locator('xpath=' + xpathInput)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Filled ${behaviorName}[${index}] -> ${fieldLabel}: ${fieldValue}`)
            })
            .fill(fieldValue);
    },

    /**
     * Updates the value of a select field within a behavior.
     * 
     * @param {puppeteer.Page} page - The Puppeteer page instance.
     * @param {string} behaviorName - The name of the behavior.
     * @param {string} fieldLabel - The label of the select field.
     * @param {string} fieldValue - The value to set for the select field.
     * @param {number} [index=1] - The index of the behavior if there are multiple with the same name.
     * @returns {Promise<void>}
     */
    updateValueForSelectFieldInBehavior: async (page, behaviorName, fieldLabel, fieldValue, index = 1) => {
        const xpathSelect = `//pm-rule-editor/pm-behavior-list//pm-behavior[div[@class="header" and contains(string(), "${behaviorName}")]][${index}]//div[akam-form-label[contains(string(), "${fieldLabel}")]]/following-sibling::div//akam-select//akam-input-action-icon`
        await page.locator('xpath=' + xpathSelect).setEnsureElementIsInTheViewport(false)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to select field in: ${behaviorName}[${index}] -> ${fieldLabel}`)
            })
            .click();

        await akamaiMenu.clickToItemInDropdown(page, fieldValue);
    },

    /**
     * Updates the value of a radio field within a behavior.
     * 
     * @param {puppeteer.Page} page - The Puppeteer page instance.
     * @param {string} behaviorName - The name of the behavior.
     * @param {string} fieldLabel - The label of the radio field.
     * @param {string} fieldValue - The value to set for the radio field.
     * @param {number} [index=1] - The index of the behavior if there are multiple with the same name.
     * @returns {Promise<void>}
     */
    updateValueForRadioFieldInBehavior: async (page, behaviorName, fieldLabel, fieldValue, index = 1) => {
        const xpathRadioBtn = `//pm-rule-editor/pm-behavior-list//pm-behavior[div[@class="header" and contains(string(), "${behaviorName}")]][${index}]//div[akam-form-label[contains(string(), "${fieldLabel}")]]/following-sibling::div//akam-radio-button[contains(string(), "${fieldValue}")]`
        await page.locator('xpath=' + xpathRadioBtn)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Update the radio field in ${behaviorName}[${index}] -> ${fieldLabel}: ${fieldValue}`)
            }).click();
    }
}
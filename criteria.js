const puppeteer = require('puppeteer');
const akamaiMenu = require('./menu');
const log = require('./log');

const setCriteriaName = async (page, criteriaName) => {

    const xpathSelect = `//pm-rule-editor/pm-match-list//pm-match[last()]//akam-select`
    await page.locator('xpath=' + xpathSelect).setEnsureElementIsInTheViewport(false).click();

    await akamaiMenu.clickToItemInDropdown(page, criteriaName)
}

const setCriteriaCondition = async (page, criteriaCondition) => {
    const xpathSelect = `//pm-rule-editor/pm-match-list//pm-match[last()]//form/pm-enum//akam-select`
    await page.locator('xpath=' + xpathSelect).setEnsureElementIsInTheViewport(false).click();

    await akamaiMenu.clickToItemInDropdown(page, criteriaCondition)
}

const setCriteriaValue = async (page, criteriaValue) => {
    const xpathInput = `//pm-rule-editor/pm-match-list//pm-match[last()]//form//input[@akamfocusablehtmlelement and @type="text"]`
    await page.locator('xpath=' + xpathInput).setEnsureElementIsInTheViewport(false).click();

    await page.locator('xpath=' + xpathInput)
        .on(puppeteer.LocatorEvent.Action, () => {
            log.white(`Filled ${criteriaValue}`)
        }).fill(criteriaValue);
}

var self = module.exports = {

    /**
     * Checks if a criteria already exists in the rules of the current Akamai property.
     * @async
     * @function checkHasExistedCriteria
     * @param {Object} page - The Puppeteer page object.
     * @param {string} criteriaName - The name of the criteria.
     * @param {string} criteriaCondition - The condition of the criteria.
     * @param {string} [criteriaVariableName=""] - The variable name of the criteria (optional).
     * @returns {Promise<boolean>} - Returns true if the criteria exists, otherwise false.
     */
    checkHasExistedCriteria: async (page, criteriaName, criteriaCondition, criteriaVariableName = "") => {
        if (criteriaName == "Variable") {
            const xpathVariable = `//pm-rule-editor/pm-match-list//pm-match[div/akam-select[contains(string(), "Variable")] 
            and div/form/pm-variable[contains(string(), "${criteriaVariableName}")] 
            and div/form/pm-enum//akam-select[contains(string(), "${criteriaCondition}")]]`
            return (await page.$('xpath=' + xpathVariable)) || false;
        } else {
            const xpathCriteria = `//pm-rule-editor/pm-match-list//pm-match[div/akam-select[contains(string(), "${criteriaName}")] and div/form/pm-enum//akam-select[contains(string(), "${criteriaCondition}")]]`
            return (await page.$('xpath=' + xpathCriteria)) || false;
        }
    },

    /**
     * Adds a new criteria to the rules of the current Akamai property.
     * @async
     * @function addNewCriteria
     * @param {Object} page - The Puppeteer page object.
     * @param {string} criteriaName - The name of the criteria.
     * @param {string} criteriaCondition - The condition of the criteria.
     * @param {string} criteriaValue - The value of the criteria.
     * @returns {Promise<void>}
     */
    addNewCriteria: async (page, criteriaName, criteriaCondition, criteriaValue) => {
        const xpathBtn = `//pm-rule-editor/pm-match-list//akam-content-panel-header[contains(string(), "Criteria")]//button`
        await page.locator('xpath=' + xpathBtn).setEnsureElementIsInTheViewport(false)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Add new criteria: ${criteriaName} ${criteriaCondition} ${criteriaValue}`)
            })
            .click();

        await setCriteriaName(page, criteriaName)
        await setCriteriaCondition(page, criteriaCondition)
        await setCriteriaValue(page, criteriaValue)
    },

    /**
     * Gets the value of a criteria by its name in the rules of the current Akamai property.
     * @async
     * @function getCriteriaValueByName
     * @param {Object} page - The Puppeteer page object.
     * @param {string} criteriaName - The name of the criteria.
     * @param {string} criteriaCondition - The condition of the criteria.
     * @param {string} [criteriaVariableName=""] - The variable name of the criteria (optional).
     * @returns {Promise<string[]>} - Returns an array of criteria values.
     */
    getCriteriaValueByName: async (page, criteriaName, criteriaCondition, criteriaVariableName = "") => {
        if (criteriaName == "Variable") {
            const xpathVariable = `//pm-rule-editor/pm-match-list//pm-match[div/akam-select[contains(string(), "Variable")] 
            and div/form/pm-variable[contains(string(), "${criteriaVariableName}")] 
            and div/form/pm-enum//akam-select[contains(string(), "${criteriaCondition}")]]`
            await page.locator('xpath=' + xpathVariable).wait();

            return await page.$$eval('xpath=' + xpathVariable + '//form//akam-tag-input//akam-tag', elements => elements.map(e => e.innerText))
        } else {
            const xpathCriteria = `//pm-rule-editor/pm-match-list//pm-match[div/akam-select[contains(string(), "${criteriaName}")] and div/form/pm-enum//akam-select[contains(string(), "${criteriaCondition}")]]`
            await page.locator('xpath=' + xpathCriteria).wait();

            return await page.$$eval('xpath=' + xpathCriteria + '//form//akam-tag-input//akam-tag', elements => elements.map(e => e.innerText))
        }
    },

    /**
     * Deletes all values in an existing criteria by clicking the 'Close' icon on each tag in the rules of the current Akamai property.
     * Note: This method may not always work well.
     * @async
     * @function deleteAllValueInExitedCriteria
     * @param {Object} page - The Puppeteer page object.
     * @param {string} criteriaName - The name of the criteria (e.g., 'Hostname', 'Path').
     * @param {number} [index=1] - The index of the criteria (optional).
     * @returns {Promise<void>}
     */
    deleteAllValueInExitedCriteria: async (page, criteriaName, index = 1) => {
        const xpathTagCloseIcons = `//pm-rule-editor/pm-match-list//pm-match//akam-select[contains(string(), "${criteriaName}")]/following-sibling::form//akam-tag-input//akam-tag//akam-icon`
        await page.locator('xpath=' + xpathTagCloseIcons).wait();

        const tagCloseIcons = await page.$$('xpath=' + xpathTagCloseIcons);
        for (let i = 0; i < tagCloseIcons.length; i++) {
            await tagCloseIcons[i].click()
        }
    },

    /**
     * Adds a new value to an existing criteria in the rules of the current Akamai property. Akamai will automatically check if the value does not exist and then insert it.
     * @async
     * @function addValueToExistedCriteria
     * @param {Object} page - The Puppeteer page object.
     * @param {string} criteriaName - The name of the criteria.
     * @param {string} newCriteriaValue - The new value to add to the criteria.
     * @param {number} [index=1] - The index of the criteria (optional).
     * @returns {Promise<void>}
     */
    addValueToExistedCriteria: async (page, criteriaName, newCriteriaValue, index = 1) => {
        const xpathInput = `//pm-rule-editor/pm-match-list//pm-match//akam-select[contains(string(), "${criteriaName}")]/following-sibling::form//input[@akamfocusablehtmlelement]`
        await page.locator('xpath=' + xpathInput)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Filled ${criteriaName}[${index}]: ${newCriteriaValue}`)
            })
            .fill(newCriteriaValue);
    }

}
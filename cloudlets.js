const puppeteer = require('puppeteer');
const log = require('./log')
const Rule = require('./cloudlets-rule');

const getPolicyVersionNumberBasedOnEnvironment = async (page, environment) => {
    const xpathStaging = `xpath=//div[@class="infoBlockAccordion"]//div[contains(@class, "panel-heading")]//div[span[string()="${environment}"]]/span[2]`
    await page.locator(xpathStaging)
        .on(puppeteer.LocatorEvent.Action, () => {
            log.white(`Navigated to policy details and click to header '${environment}'`)
        }).click();

    await new Promise(r => setTimeout(r, 1000));
    const versionNumber = await page.$eval(xpathStaging, el => el.innerText);
    return versionNumber;
}

/**
 * When you are in 'Policy Details' page and clicked '...' icon in one version row has matched `versionNumber` to open the menu
 * 
 * you can choose the action item by name `menuItemText` in given menu
 * @param {*} page 
 * @param {*} versionNumber
 * @param {*} menuItemText 
 */
const clickToMenuItemInPolicyDetailsPage = async (page, versionNumber, menuItemText) => {
    const xpathTdIcon = `xpath=//akam-table//table//tr[td[@row-property="version"][contains(string(), "${versionNumber}")]]/td[last()]/div`
    const matchItemPath = `${xpathTdIcon}//ul[@class="dropdown-menu"]/li[contains(string(),"${menuItemText}")]`
    await page.locator(matchItemPath)
        .on(puppeteer.LocatorEvent.Action, () => {
            log.white(`Click to item ${menuItemText} in given menu`)
        })
        .click();
}


var self = module.exports = {
    Rule,

    /**
     * When you are in 'Cloudlets Policy Manager' page, you can navigate to 'Policy Details' page by searching by policy name
     * @param {*} page the Puppeteer's page object
     * @param {*} policyName the policy name
     */
    goToCloudletsPolicyByName: async (page, policyName) => {
        await page.locator('xpath=//akam-table[@id-property="policyId"]//table/tbody/tr').wait();

        const xpthSearchInput = `//div[contains(@class, "cloudletsView")]//input[@type="search"]`
        await page.locator('xpath=' + xpthSearchInput)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Fill in search box with policy name: '${policyName}'`)
            })
            .fill(policyName)

        const matchResult = `//div[contains(@class, "cloudletsView")]//table//tr[td[contains(string(), "${policyName}")]]/td[1]//a`
        await page.locator('xpath=' + matchResult)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.yellowBg(`Click to policy: '${policyName}'`)
            }).click()
        await page.waitForNavigation();
    },

    /**
     * When you are in 'Policy Details' page, you can get the staging version number
     * @param {*} page The Puppeteer's page object
     * @returns 
     */
    getStagingPolicyVersionNumber: async (page) => {
        return await getPolicyVersionNumberBasedOnEnvironment(page, "Staging");
    },

    /**
     * When you are in 'Policy Details' page, you can get the production version number
     * @param {*} page The Puppeteer's page object
     * @returns 
     */
    getProductionPolicyVersionNumber: async (page) => {
        return await getPolicyVersionNumberBasedOnEnvironment(page, "Production");
    },

    /**
     * When you are in 'Policy Details' page, you can check if there has a draft version based on other version number
     * @param {*} page The Puppeteer's page object
     * @param {*} baseVersionNumber The base version number, ex 'v40'
     * @returns true if there has a draft version based on other version number otherwise false
     */
    checkHasDraftVersionBasedOnOtherVersionNumber: async (page, baseVersionNumber) => {
        const xpath = `//akam-table//table//tr[td[@row-property="description"][contains(string(), "${baseVersionNumber}")]]/td[1][a[count(i) = 0]]`

        if (await page.$('xpath=' + xpath)) {
            return true;
        }
        return false;
    },

    /**
     * When you are in 'Policy Details' page, you can navigate to the latest draft version based on other version number
     * @param {*} page The Puppeteer's page object
     * @param {*} baseVersionNumber The base version number, ex 'v40'
     * @returns 
     */
    goToLatestDraftVersionBasedOnVersionNumber: async (page, baseVersionNumber) => {
        const xpathVersion = `//akam-table//table//tr[td[@row-property="description"][contains(string(), "${baseVersionNumber}")]]/td[1]/a[count(i) = 0]`
        const versionName = await page.$eval('xpath=' + xpathVersion, el => el.innerText);

        await page.locator('xpath=' + xpathVersion)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to the draft version number: '${versionName}'`)
            }).click();
        await page.waitForNavigation();
    },

    /**
     * When you are in 'Policy Details' page, you can navigate to the version details page based on version number
     * @param {*} page The Puppeteer's page object
     * @param {*} versionNumber The base version number, ex 'v40'
     * @returns 
     */
    goToVersionDetailsBasedOnVersionNumber: async (page, versionNumber) => {
        const xpathIcon = `xpath=//akam-table//table//tr/td[@row-property="version"][contains(string(), "${versionNumber}")]/a`
        await page.locator(xpathIcon)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to open the policy: '${versionNumber}'`)
            }).click()

        await page.waitForNavigation();
    },

    /**
     * When you are in 'Policy Details' page, you can create the new policy version based on previous version
     * @param {*} page 
     * @param {*} baseVersionNumber 
     * @param {*} versionNote 
     */
    createNewVersionBasedOnVersionNumber: async (page, baseVersionNumber, versionNote) => {
        const xpathIcon = `xpath=//akam-table//table//tr[td[@row-property="version"][contains(string(), "${baseVersionNumber}")]]/td[last()]/div`
        await page.locator(xpathIcon)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click '...' to open the menu of based policy version '${baseVersionNumber}' row`)
            }).click()

        await clickToMenuItemInPolicyDetailsPage(page, baseVersionNumber, "Edit New Version")

        const xpathNotes = `xpath=//div[@class="policyVersionModal"]//textarea[@name="notes"]`
        await page.locator(xpathNotes)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Fill the policy version's notes: '${versionNote}'`)
            }).fill(`${versionNote} (Based on ${baseVersionNumber})`)

        const xpathSaveBtn = `xpath=//div[@class="modal-footer"]/button[contains(string(), "Edit New Version")]`
        await page.locator(xpathSaveBtn).on(puppeteer.LocatorEvent.Action, () => {
            log.white(`Click to 'Edit New Version' button to create new version: '${versionNote}'`)
        }).click()

        await page.waitForNavigation();
    },

    /**
     * When you are in 'Version Details' page, you can save all changes for this version
     * @param {*} page 
     * @returns 
     */
    savePolicyVersionChanges: async (page) => {
        await new Promise(r => setTimeout(r, 1000));

        const versionName = await page.$eval('xpath=//div[contains(@class, "policyVersionDetails")]//span', el => el.innerText);
        await page.locator('xpath=//div[contains(@class, "policyVersionDetails")]//span').click()

        const xBtnSave = `//akam-table-toolbar//button[contains(string(), "Save Changes")]`
        const isDisabled = await page.$eval('xpath=' + xBtnSave, el => el.disabled)
        if (!isDisabled) {
            const [res] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/cloudlets/api/v2/policies/')),
                await page.locator('xpath=//akam-table-toolbar//button[contains(string(), "Save Changes")]')
                .on(puppeteer.LocatorEvent.Action, () => {
                    log.white(`Click to 'Save Changes' button`)
                }).click()
            ]);
            const result = res ? await res.json() : {};
            const matchRules = result ? result.matchRules : undefined;
            const warnings = result ? result.warnings : undefined;
            if (matchRules) {
                log.greenBg(`Saved policy ${versionName} successfully. ${warnings ? "There are some warnings" : ""}`);
                return true;
            }
            return false;
        } else {
            log.red(`There is nothing change in the policy ${versionName}. The "Save Changes" button is disabled.`)
            return false
        }
    },

    /**
     * When you are in 'Version Details' page, you can active staging for this version
     * @param {*} page 
     * @returns 
     */
    activeStagingForCurrentVersion: async (page) => {
        const xpathBtn = `xpath=//div[contains(@class, "buttonsRow")]//button[contains(string(), "Activate Version")]`
        await page.locator(xpathBtn).click();

        await page.locator(`xpath=//form[@name="policyForm"]//select[@name="network"]`).fill("string:staging")

        await new Promise(r => setTimeout(r, 1000));

        await page.locator(`xpath=//div[@class="modal-header"]//h4`).click()

        const versionName = await page.$eval(`xpath=//form[@name="policyForm"]//select[@name="version"]/option[@selected="selected"]`, el => el.innerText)

        const [res] = await Promise.all([
            page.waitForResponse(res => res.url().includes('cloudlets/api/v2/policies/')),
            await page.locator(`xpath=//div[@class="modal-footer"]//button[contains(string(), "Activate Version")]`)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to Active the version: '${versionName}'`)
            }).click()
        ]);


        return versionName;
    }

}
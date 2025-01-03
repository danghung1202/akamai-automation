const puppeteer = require('puppeteer');
const log = require('./log');

/**
 * When you are in Property page, you can get version number of staging/production
 * @param {*} page The Puppeteer's page object
 * @param {*} environment `STAGING` | `PRODUCTION`
 * @returns Version number, ex Version 50
 */
const getVersionNumberOfStagingOrProduction = async (page, environment) => {
    const xpathActiveVersion = `//pm-active-version[@network="${environment}"]//pm-version-link//span`;
    //Waiting for element to be visible
    await page.locator('xpath=' + xpathActiveVersion).wait();

    const versionNumber = await page.$eval('xpath=' + xpathActiveVersion, el => el.innerText);
    return versionNumber
}

/**
 * When you are in Property page, you can navigate to staging/production version page
 * @param {*} page The Puppeteer's page object
 * @param {*} environment `STAGING` | `PRODUCTION`
 * @returns 
 */
const goToStagingOrProductionPropertyPage = async (page, environment) => {
    const xpathStaging = `//pm-active-version[@network="${environment}"]//pm-version-link//a`;
    await page.locator('xpath=' + xpathStaging)
        .on(puppeteer.LocatorEvent.Action, () => {
            log.green(`Click to navigate the ${environment} version`)
        }).click();
    await page.waitForNavigation();
}

/**
 * When you are in Property page, you click to create new version based on staging/production version
 * @param {*} page The Puppeteer's page object
 * @param {*} environment `STAGING` | `PRODUCTION`
 * @returns 
 */
const clickToNewVersionBasedOnStagingOrProd = async (page, environment) => {
    // await page.locator(`xpath=//pm-active-version[@network="${environment}"]//button[contains(text(), "New Version")]/following-sibling::button`)
    //     .on(puppeteer.LocatorEvent.Action, () => {
    //         log.green(`Click to button menu`)
    //     })
    //     .click()

    // await new Promise(r => setTimeout(r, 1000));

    const xpathNewVersion = `//pm-active-version[@network="${environment}"]//button[contains(text(), "New Version")]`
    await page.locator('xpath=' + xpathNewVersion)
        .on(puppeteer.LocatorEvent.Action, () => {
            log.green(`Click to create the new version based on ${environment} version`)
        }).click();
    await page.waitForNavigation();
    //const xpathVersionMenu = '//pm-active-version[@network="STAGING"]//button[contains(text(), "New Version")]/following-sibling::button'
    //const buttonMenu = await page.locator('xpath=' + xpathVersionMenu).click();
}

const self = module.exports = {

    /**
     * Navigate to the property page by domain.
     * @param {*} page The Puppeteer's page object
     * @param {string} domain The domain name to search for.
     * @returns {Promise<boolean>} True if navigation is successful, otherwise false.
     */
    goToPropertyPageByDomain: async (page, domain) => {
        try {
            const searchInput = '//akamai-portal-search//input[contains(@class,"search")]';

            await page.locator('xpath=' + searchInput).fill(domain);


            const searchItem = '//akamai-portal-search-result-category/div[contains(string(div), "www.' + domain + '")]//a';

            await page.locator('xpath=' + searchItem)
                .on(puppeteer.LocatorEvent.Action, () => {
                    log.yellowBg(`Click to link contains ${domain}`)
                }).click();
            await page.waitForNavigation();
            //click 'escape' to close the search suggestion result
            await page.keyboard.press('Escape')

            return true;
        } catch (error) {
            log.red(`Can not find the Property by ${domain}: ${error}`);
            return false;
        }
    },
    /**
     * Navigate to the property page by version number.
     * @param {*} page The Puppeteer's page object
     * @param {string} versionNumber The version number to navigate to.
     * @returns {Promise<void>}
     */
    goToPropertyByVersionNumber: async (page, versionNumber) => {
        //sometime click to property detail link is not work. This is workaround
        await new Promise(r => setTimeout(r, 1000));
        await page.locator('xpath=//pm-page-header//div[@pmpageheadersubtitle]').click()

        const xpath = `//tr/td[contains(@class, "akam-column-version") and contains(string(), "${versionNumber}")]//a`
        await page.locator('xpath=' + xpath)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.green(`Click to navigate the property ${versionNumber}`)
            }).click();
        await page.waitForNavigation();
    },

    /**
     * Get the number of STAGING version when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @returns {Promise<string>} Version number, e.g., "Version 50".
     */
    getStagingVersionNumber: async (page) => {
        return await getVersionNumberOfStagingOrProduction(page, "STAGING")
    },

    /**
     * Get the hostnames of the STAGING version when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @returns {Promise<string[]>} Array of hostnames.
     */
    getHostnamesOfStagingVersion: async (page) => {
        const xpath = `//pm-active-version[@network="STAGING"]//label[text()="Hostnames"]/following-sibling::div/div`;
        await page.locator('xpath=' + xpath).wait();

        const hostnames = await page.$$eval('xpath=' + xpath, elements => elements.map(e => e.innerText));
        return hostnames;
    },

    /**
     * Get the number of PRODUCTION version when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @returns {Promise<string>} Version number, e.g., "Version 50".
     */
    getProductionVersionNumber: async (page) => {
        return await getVersionNumberOfStagingOrProduction(page, "PRODUCTION")
    },

    /**
     * Navigate to the STAGING version page when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @returns {Promise<void>}
     */
    goToStagingPropertyPage: async (page) => {
        await goToStagingOrProductionPropertyPage(page, "STAGING")
    },

    /**
     * Navigate to the PRODUCTION version page when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @returns {Promise<void>}
     */
    goToProductionPropertyPage: async (page) => {
        await goToStagingOrProductionPropertyPage(page, "PRODUCTION")
    },

    /**
     * Click to create a new version based on the STAGING version when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @returns {Promise<void>}
     */
    clickToNewVersionBasedOnStaging: async (page) => {
        await clickToNewVersionBasedOnStagingOrProd(page, "STAGING")
    },

    /**
     * Click to create a new version based on the PRODUCTION version when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @returns {Promise<void>}
     */
    clickToNewVersionBasedOnProduction: async (page) => {
        await clickToNewVersionBasedOnStagingOrProd(page, "PRODUCTION")
    },

    /**
     * Check if there is a draft version based on another version number when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @param {string} baseVersionNumber The base version number, e.g., "Version 40".
     * @returns {Promise<boolean>} True if there is a draft version, otherwise false.
     */
    checkHasDraftVersionBasedOnOtherVersionNumber: async (page, baseVersionNumber) => {
        const xpath = `//tr[td[contains(@class, "akam-column-basedOn") and contains(string(), "${baseVersionNumber}")] and td[contains(@class, "akam-column-stagingStatus") and contains(string(), "Inactive")]]/td[contains(@class, "akam-column-version")]//a`

        if (await page.$('xpath=' + xpath)) {
            return true;
        }
        return false;
    },

    /**
     * Get latest draft version number based on a version number when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @param {string} baseVersionNumber The base version number, e.g., "Version 40".
     * @returns {Promise<void>} The version number if found, otherwise undefined.
     */
    getLatestDraftVersionBasedOnOtherVersionNumber: async (page, baseVersionNumber) => {
        const hasDraftVersion =await self.checkHasDraftVersionBasedOnOtherVersionNumber(page, baseVersionNumber);
        if (!hasDraftVersion) {
            return undefined;
        }

        const matchTr = `//tr[td[contains(@class, "akam-column-basedOn") and contains(string(), "${baseVersionNumber}")] and td[contains(@class, "akam-column-stagingStatus") and contains(string(), "Inactive")]]/td[contains(@class, "akam-column-version")]`
        const xpathVersion = `${matchTr}//span`
        const versionName = await page.$eval('xpath=' + xpathVersion, el => el.innerText);

        return versionName;
    },

    /**
     * Navigate to the latest draft version based on a version number when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @param {string} baseVersionNumber The base version number, e.g., "Version 40".
     * @returns {Promise<void>}
     */
    goToLatestDraftVersionBasedOnVersionNumber: async (page, baseVersionNumber) => {
        const matchTr = `//tr[td[contains(@class, "akam-column-basedOn") and contains(string(), "${baseVersionNumber}")] and td[contains(@class, "akam-column-stagingStatus") and contains(string(), "Inactive")]]/td[contains(@class, "akam-column-version")]`
        const xpathVersion = `${matchTr}//span`
        const versionName = await page.$eval('xpath=' + xpathVersion, el => el.innerText);

        const xpath = `${matchTr}//a`
        await page.locator('xpath=' + xpath)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.green(`Click to the draft version number: '${versionName}'`)
            }).click();
        await page.waitForNavigation();
    },

    /**
     * Update the property note when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @param {string} notes The notes to update.
     * @returns {Promise<void>}
     */
    updatePropertyNote: async (page, notes) => {
        const xpath = `//pm-version-info//akam-text-area/textarea`
        await page.locator('xpath=' + xpath)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Fill the property note with value: ${notes}`)
            }).fill(notes)
    },

    /**
     * Click the 'Save' button to save all changes when you are in the Property details page.
     * @param {*} page The Puppeteer's page object
     * @returns {Promise<string|boolean>} The version number if saved successfully, otherwise false.
     */
    saveThePropertyChange: async (page) => {
        await new Promise(r => setTimeout(r, 1000));

        const versionName = await page.$eval('xpath=//pm-page-header//span[@pmpageheadersubtitle]', el => el.innerText);
        await page.locator('xpath=//pm-page-header//span[@pmpageheadersubtitle]').click()

        const xBtnSave = `//div[contains(@class,"edit-actions")]/button[text()="Save"]`; //[not(@disabled)]
        const isDisabled = await page.$eval('xpath=' + xBtnSave, el => el.disabled)
        if (!isDisabled) {
            const [res] = await Promise.all([
                page.waitForResponse(res => res.url().includes('/service/v1/properties/version')),
                await page.locator('xpath=' + xBtnSave).on(puppeteer.LocatorEvent.Action, () => {
                    log.white(`Click to Save the version: '${versionName}'`)
                }).click()
            ]);
            const response = res ? await res.json() : undefined;
            const result = response ? response.result : undefined;
            if (result) {
                if (result == "ERROR") {
                    log.redBg(`Saved version ${versionName} successfully but has ERROR. Review the changes`);
                } else {
                    log.greenBg(`Saved version ${versionName} successfully with ${result}`);
                }

                const versionNumbers = versionName.split(" ")
                return versionNumbers[1];
            }
            return false;
        } else {
            log.red(`There is nothing change in the version ${versionName}. The "Save" button is disabled.`)
            return false
        }
    },

    /**
     * Get the summary information of a property by version number.
     * @param {*} page The Puppeteer's page object
     * @param {string} versionNumber The version number to get the summary for, for example, "Version 50".
     * @returns {Promise<Object>} JSON object containing `{version, lastEdited, author, notes}`.
     */
    getSummaryOfPropertyVersion: async (page, versionNumber) => {
        const xpathTr = `//table//tr[td[contains(@class, "akam-column-version")  and contains(string(), "${versionNumber}")]]`
        await page.locator('xpath=' + xpathTr).wait()
        const lastEdited = await page.$eval(`xpath=${xpathTr}/td[contains(@class,"akam-column-lastEdited")]`, el => el.innerText)
        const author = await page.$eval(`xpath=${xpathTr}/td[contains(@class,"akam-column-lastEditedByUser")]`, el => el.innerText)
        const notes = await page.$eval(`xpath=${xpathTr}/td[contains(@class,"akam-column-notes")]`, el => el.innerText)
        const basedOn = await page.$eval(`xpath=${xpathTr}/td[contains(@class,"akam-column-basedOn")]`, el => el.innerText)

        return {
            version: versionNumber,
            basedOn,
            lastEdited,
            author,
            notes
        }
    },

    /**
     * Activate the property on STAGING when you are in the Property page.
     * @param {*} page The Puppeteer's page object
     * @returns {Promise<boolean>} True if activation is successful, otherwise false.
     */
    activePropertyOnStaging: async (page) => {
        await page.waitForSelector('xpath=//pm-page-header//span[@pmpageheadersubtitle]');
        const versionName = await page.$eval('xpath=//pm-page-header//span[@pmpageheadersubtitle]', el => el.innerText);

        const xActive = `xpath=//akam-tabs//ul/li[contains(string(), "Activate")]`
        await page.locator(xActive).click()

        const testBtn = `xpath=//pm-app-test-center-button[@network="STAGING"]//button`
        await page.locator(testBtn).wait();

        const xActiveBtn = `xpath=//pm-activation-control[@network="STAGING"]//button[contains(string(), "Activate")]`
        let hasActiveBtn = (await page.$(xActiveBtn)) || false;
        if (!hasActiveBtn) {
            log.white(`The version: '${versionName}' has been activated on Staging`)
            return false;
        }
        await page.locator(xActiveBtn).click();

        const detailVersion = `xpath=//pm-activation-modal//pm-compliance//label[@for="notes"]`
        await page.locator(detailVersion).setTimeout(30000).wait();

        const publishToStaging = `xpath=//div[@class="akam-modal-actions"]/button[contains(string(), "Activate ")]`
        const [res] = await Promise.all([
            page.waitForResponse(res => res.url().includes('/service/v1/properties/activate')),
            await page.locator(publishToStaging).on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to Activate the version: '${versionName}'`)
            }).click()
        ]);

        const response = res ? await res.json() : undefined;
        if (response) {
            log.greenBg(`Activating the version: '${versionName}' successfully`)
            return true;
        }
        log.redBg(`Can not activating the version: '${versionName}'`)
        return false
    }

}
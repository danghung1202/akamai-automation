const puppeteer = require('puppeteer');

const Variable = require('./variable');
const Rule = require('./rule');
const Behavior = require('./behavior');
const Criteria = require('./criteria');
const Menu = require('./menu');
const Property = require('./property');
const Cloudlets = require('./cloudlets');
const log = require('./log');
const bluebird = require("bluebird");

const divideIntoBatches = (arrayData, numberOfBatches) => {
    // Function to divide domains into batches
    const divideIntoBatchesByBatchSize = (domains, batchSize) => {
        const batches = [];
        for (let i = 0; i < domains.length; i += batchSize) {
            batches.push(domains.slice(i, i + batchSize));
        }
        return batches;
    };

    // Calculate batch size based on the number of batches
    numberOfBatches = numberOfBatches > 0 ? numberOfBatches : 1; // Ensure maxConcurrency is at least 1
    const batchSize = Math.max(1, Math.ceil(arrayData.length / numberOfBatches));

    // Divide all domains into batches
    const batchOfData = divideIntoBatchesByBatchSize(arrayData, batchSize);
    return batchOfData;
}

var self = module.exports = {
    Property,
    Variable,
    Rule,
    Criteria,
    Behavior,
    Menu,
    Cloudlets,

    /**
     * Executes the `processArrayItem` function in parallel for the array of data with a specified concurrency limit.
     * 
     * @param {object} browser - The Puppeteer browser object.
     * @param {object} cookies - The cookies json object to login Akamai.
     * @param {Array} arrayData - An array of data need to process. The data may be array of strings or 
     * array of objects, depending on the processArrayItem function.
     * @param {Function} processArrayItem - The function to process each object in the `arrayData` array. 
     * The signature of this function should be `async (page, item) => {}`.
     * @param {Function} onComplete - The function to call when all items in `arrayData` have been processed. 
     * The signature of this function should be `async (browser, result) => {}`. The result is from the `processArrayItem` function.
     * @param {Function} onError - The function to call when an error occurs during processing of a item.
     * The signature of this function should be `(page, item, error) => {}`.
     * @param {number} [maxConcurrency=3] - The maximum number of concurrent executions. Default is 3.
     */
    paralleExecute: async (browser, cookies, arrayData, processArrayItem, onComplete, onError, maxConcurrency = 3) => {

        const result = [];
        const batchOfData = divideIntoBatches(arrayData, maxConcurrency);

        await bluebird.map(batchOfData, async (domainGroup) => {
            const page = await browser.newPage();
            const session = await page.createCDPSession();
            await session.send(`Emulation.setFocusEmulationEnabled`, { enabled: true });
            await self.loginToAkamaiUsingCookies(page, cookies);
            await self.acceptTheUnsavedChangesDialogWhenNavigate(page);
            
            for (let i = 0; i < domainGroup.length; i++) {
                try {
                    const domainResult = await processArrayItem(page, domainGroup[i]);
                    result.push(domainResult);
                } catch (error) {
                    if (onError) { onError(page, domainGroup[i], error); }
                    else {
                        log.red(`Error processing domain ${domainGroup[i]}: ${error.message}`);
                    }
                }
            }

            await page.close();
        }, { concurrency: maxConcurrency });

        await onComplete(browser, result);
    },

    /**
     * Login to akamai home page using the cookies
     * @param {*} page 
     * @param {*} cookies Array of cookie json, for example: 
     * 
     * [ {
        "domain": ".akamai.com",
        "expirationDate": 1752203422.539523,
        "hostOnly": false,
        "httpOnly": false,
        "name": "_abck",
        "path": "/",
        "sameSite": "unspecified",
        "secure": true,
        "session": false,
        "storeId": "0",
        "value": "xxxx",
        "id": 1
    } ]

    After you logged in to site, you can using some chrome extension to export the cookies
     * @param {*} url [Optional] The akamai page url, default `https://control.akamai.com/`
     */
    loginToAkamaiUsingCookies: async (page, cookies, url = "https://control.akamai.com/") => {
        // Set the cookies on the page
        await page.setCookie(...cookies);

        await page.setViewport({
            width: 1400,
            height: 900
        })
        await page.goto(url, {
            waitUntil: 'domcontentloaded'
        })
    },

    /**
     * Accept the the dialog `Any unsaved changes will be discarded` when navigate to new page without click 'Save' button to save all changes in property
     * 
     * This method should be invoked only one after login successfully to akamai
     * @param {*} page 
     */
    acceptTheUnsavedChangesDialogWhenNavigate: async (page) => {
        page.on('dialog', async dialog => {
            const message = dialog.message()
            log.white(`The page show the dialog with message ${message}`);
            if (message.includes('Any unsaved changes will be discarded')) {
                log.white(`Clicking "Yes/Ok" to ${message}`);
                await dialog.accept(); // press 'Yes'
            } else {
                log.white(`Clicking "No/Cancel" to ${message}`);
                await dialog.dismiss(); // press 'No'
            }
        });
    },

    /**
     * Go to the latest draft version of the property based on the version 'production' or 'staging'.
     * 
     * Create the new version if the property does not have the draft version. Then go to the new version.
     *
     * @param {object} page - The Puppeteer page object.
     * @param {string} domain - The domain name of the property.
     * @param {string} versionType - The type of version to handle ('production' or 'staging').
     * @returns {Promise<void>} A promise that resolves when the operation is complete.
     */
    goToLatestDraftVersionBasedOnVersionType: async (page, domain, versionType) => {
        await Property.goToPropertyPageByDomain(page, domain);

        const versionNumber = versionType === 'production'
            ? await Property.getProductionVersionNumber(page)
            : await Property.getStagingVersionNumber(page);

        console.log(`${versionType} version ${versionNumber}`);
        const hasDraftVersion = await Property.checkHasDraftVersionBasedOnOtherVersionNumber(page, versionNumber);
        if (hasDraftVersion) {
            await Property.goToLatestDraftVersionBasedOnVersionNumber(page, versionNumber);
        } else {
            if (versionType === 'production') {
                await Property.clickToNewVersionBasedOnProduction(page);
            } else {
                await Property.clickToNewVersionBasedOnStaging(page);
            }
        }
    }
}
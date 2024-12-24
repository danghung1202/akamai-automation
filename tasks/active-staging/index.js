const puppeteer = require('puppeteer');

const jsonIO = require('../../helper/json-io');
const akamai = require('../../akamai');
const log = require('../../log');
const json2csv = require('json2csv').parse;
const fs = require('fs');

/**
 * Processes a domain by navigating to its property page and retrieving version information.
 * 
 * @param {Object} page - The Puppeteer page object.
 * @param {string} domain - The domain to process.
 * @returns {Object} An object containing the domain's hostname, staging and production version information.
 */
const processDomain = async (page, data) => {
    const { domain, version } = data;

    log.green(`Processing domain: ${domain}: ${version}`);
    const result = { domain, version, isSuccessful: false };

    try {
        await akamai.Property.goToPropertyPageByDomain(page, domain);

        await akamai.Property.goToPropertyByVersionNumber(page, version.replace("v", 'Version '))

        await akamai.Property.activePropertyOnStaging(page)

        log.green(`Active successfully: ${domain}: ${version}`)
        result.isSuccessful = true;
    } catch (error) {
        result.isSuccessful = false;
    }
    return result;
};

const onComplete = async (browser, result) => {
    // Filter out null results
    result = result.filter(item => item !== null);

    // Convert to CSV
    const fields = []
    if (result.length > 0) {
        const firstItem = result[0];
        fields.push(...Object.keys(firstItem));

        // Sort result by hostname alphabetically
        result.sort((a, b) => a.domain.localeCompare(b.domain));

        log.greenBg('The result: ');
        log.greenBg(JSON.stringify(result))
    } else { log.yellowBg('No file to save'); }

    //await browser.close();
};


/**
 * Handles errors that occur during the processing of a domain.
 * 
 * @param {string} domain - The domain that caused the error.
 * @param {Error} error - The error that occurred.
 */
const onError = (page, data, error) => {
    log.red(`Error processing domain ${data.domain}: ${error.message}`);
};

(async () => {
    const allDomains = await jsonIO.readJson('./tasks/active-staging/data.json');

    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 15
    });

    const cookies = await jsonIO.readJson('./data/cookies.json');

    await akamai.paralleExecute(browser, cookies, allDomains, processDomain, onComplete, onError, 4);
})()
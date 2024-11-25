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
const processDomain = async (page, domain) => {
    await akamai.Property.goToPropertyPageByDomain(page, domain);

    const stagingVersion = await akamai.Property.getStagingVersionNumber(page);
    const productionVersion = await akamai.Property.getProductionVersionNumber(page);
    const staging = await akamai.Property.getSummaryOfPropertyVersion(page, stagingVersion);
    const production = await akamai.Property.getSummaryOfPropertyVersion(page, productionVersion);

    log.green(`${domain} Get info successfully`);
    return {
        hostname: domain,
        staging: staging.version,
        stagingLastEdited: staging.lastEdited,
        stagingAuthor: staging.author,
        stagingNotes: staging.notes,
        production: production.version,
        productionLastEdited: production.lastEdited,
        productionAuthor: production.author,
        productionNotes: production.notes,
    };
};

const onComplete = async (browser, result) => {
    // Filter out null results
    result = result.filter(item => item !== null);

    // Convert to CSV
    const fields = ['hostname',
        'staging',
        'stagingLastEdited',
        'stagingAuthor',
        'stagingNotes',
        'production',
        'productionLastEdited',
        'productionAuthor',
        'productionNotes',];

    // Sort result by hostname alphabetically
    result.sort((a, b) => a.hostname.localeCompare(b.hostname));

    const csv = json2csv(result, { fields });

    // Save CSV to file
    const date = new Date();
    const formattedDate = date.toISOString().replace(/[-T:.Z]/g, '').slice(0, 12);
    const fileName = `versions_${formattedDate}.csv`;
    fs.writeFileSync(`./tasks/property-get-version/${fileName}`, csv);
    log.greenBg('Save file successfully');

    //await browser.close();
};


/**
 * Handles errors that occur during the processing of a domain.
 * 
 * @param {string} domain - The domain that caused the error.
 * @param {Error} error - The error that occurred.
 */
const onError = (page, domain, error) => {
    log.red(`Error processing domain ${domain}: ${error.message}`);
};

(async () => {
    const allDomains = await jsonIO.readJson('./data/domains.json');

    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 13
    });

    const cookies = await jsonIO.readJson('./data/cookies.json');

    await akamai.paralleExecute(browser, cookies, allDomains, processDomain, onComplete, onError, 4);
})()
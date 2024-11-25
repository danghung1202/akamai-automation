const puppeteer = require('puppeteer');

const jsonIO = require('../../helper/json-io');
const akamai = require('../../akamai');
const log = require('../../log');
const json2csv = require('json2csv').parse;
const fs = require('fs');
const bluebird = require("bluebird");

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 13
    })
    const akamaiUrl = "https://control.akamai.com/";
    const cookies = await jsonIO.readJson('./data/cookies.json');
    const domains1 = await jsonIO.readJson('./data/domains.json');

    const filterDomains = (domains, keyword) => domains.filter(domain => domain.includes(keyword));
    const keywords = ['electrolux', 'aeg', 'zanussi'];
    const alls = keywords.map(keyword => filterDomains(domains1, keyword));

    const result = [];

    bluebird.map(alls, async (domains) => {
        log.green(`${domains} Get info successfully`)
        const page = await browser.newPage();

        const session = await page.createCDPSession();
        await session.send(`Emulation.setFocusEmulationEnabled`, { enabled: true });

        await akamai.loginToAkamaiUsingCookies(page, cookies, akamaiUrl);
        for (let i = 0; i < domains.length; i++) {
            try {
                await akamai.Property.goToPropertyPageByDomain(page, domains[i]);

                const stagingVersion = await akamai.Property.getStagingVersionNumber(page)
                const productionVersion = await akamai.Property.getProductionVersionNumber(page)
                const staging = await akamai.Property.getSummaryOfPropertyVersion(page, stagingVersion)
                const production = await akamai.Property.getSummaryOfPropertyVersion(page, productionVersion)

                result.push({
                    hostname: domains[i],
                    staging: staging.version,
                    stagingLastEdited: staging.lastEdited,
                    stagingAuthor: staging.author,
                    stagingNotes: staging.notes,
                    production: production.version,
                    productionLastEdited: production.lastEdited,
                    productionAuthor: production.author,
                    productionNotes: production.notes,
                })
                log.green(`${domains[i]} Get info successfully`)

            } catch (error) {
                log.redBg(domains[i] + ": " + error);
            }
        }

    }, { concurrency: 3 })
        .then(() => {
            // Convert to CSV
            const fields = ['hostname',
                'staging',
                'stagingLastEdited',
                'stagingAuthor',
                'stagingNotes',
                'production',
                'productionLastEdited',
                'productionAuthor',
                'productionNotes',
                'edgeRedirectPolicyName'];

            const csv = json2csv(result, { fields });

            // Save CSV to file
            fs.writeFileSync('./tasks/property-get-version/versions123.csv', csv);
            log.greenBg('Save file successfully')

            //await browser.close()
        })
})()
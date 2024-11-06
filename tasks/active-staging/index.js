const puppeteer = require('puppeteer');

const jsonIO = require('../../helper/json-io');
const akamai = require('../../akamai');
const log = require('../../log');


(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 12
    })
    const page = await browser.newPage();

    const akamaiUrl = "https://control.akamai.com/";
    const cookies = await jsonIO.readJson('./data/cookies.json');
    const data = await jsonIO.readJson('./tasks/active-staging/data.json');
    await akamai.acceptTheUnsavedChangesDialogWhenNavigate(page);

    log.greenBg('===============================================================');
    log.white('Active staging');

    for (let i = 0; i < data.length; i++) {
        try {

            await akamai.Property.goToPropertyPageByDomain(page, data[i+1].domain);

            await akamai.Property.goToPropertyByVersionNumber(page, data[i+1].version.replace("v", 'Version '))

            await akamai.Property.activePropertyOnStaging(page)

            log.green(`Active successfully: ${data[i+1].domain}: ${data[i+1].version}`)

        } catch (error) {
            log.redBg(data[i].domain + ": " + error);
            await page.screenshot({
                path: `./logs/${data[i].domain}.png`,
            });
        } finally {
            log.yellowBg('===============================================================');
        }
    }

    //await browser.close()
})()

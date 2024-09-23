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
    const policies = await jsonIO.readJson('./tasks/cloudlets-active/data.json');
    //console.log(JSON.stringify(policies));

    await akamai.loginToAkamaiUsingCookies(page, cookies, akamaiUrl);
    const result = []
    for (let i = 0; i < policies.length; i++) {
        const policyName = policies[i].CloudletPolicy;
        try {

            var version = policies[i].Version;

            if (version == "") continue;
            version = `v${version}`;

            const cloudletsUrl = "https://control.akamai.com/apps/cloudlets/#/policies?gid=85373";
            await page.goto(cloudletsUrl, {
                waitUntil: 'domcontentloaded'
            })

            await akamai.Cloudlets.goToCloudletsPolicyByName(page, policyName);

            const stagingVersion = await akamai.Cloudlets.getStagingPolicyVersionNumber(page)
            const productionVersion = await akamai.Cloudlets.getProductionPolicyVersionNumber(page)
            log.white('staging ' + stagingVersion + ' production ' + productionVersion)

            if (version != stagingVersion) {
                await akamai.Cloudlets.goToVersionDetailsBasedOnVersionNumber(page, version)

                const versionActive = await akamai.Cloudlets.activeStagingForCurrentVersion(page)
                result.push(`${policyName},${versionActive}`)
                log.green(`${policyName} Active successfully`)
            } else {
                log.yellow(`${policyName} active already`)
            }

        } catch (error) {
            log.redBg(policyName + ": " + error);
        }
    }

    await page.screenshot({
        path: 'home.png',
    });
    //await browser.close()
})()
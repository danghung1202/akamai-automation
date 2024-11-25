const puppeteer = require('puppeteer');
const log = require('./log')

/**
 * When you are in 'Version Details' page and clicked '...' icon in one rule row has matched `ruleName` to open the menu
 * 
 * you can choose the action item by name `menuItemText` in given menu
 * @param {*} page 
 * @param {*} ruleName
 * @param {*} menuItemText 
 */
const clickToMenuItemInVersionDetailsPage = async (page, ruleName, menuItemText) => {
    const rowContainsMenuXpath = `xpath=//div[contains(@class, "akamaiTableRules")]//table/tbody/tr[td[contains(@class, "name-column")][contains(string(), "${ruleName}")]]/td[last()]/div`
    const matchItemPath = `${rowContainsMenuXpath}//ul[@class="dropdown-menu"]/li[contains(string(),"${menuItemText}")]`
    await page.locator(matchItemPath)
        .on(puppeteer.LocatorEvent.Action, () => {
            log.white(`Click to item ${menuItemText} in given menu`)
        })
        .click();
}


var self = module.exports = {

    /**
     * When you are in 'Version Details' page, 
     * 
     * you click '...' in the rule row has match `ruleName` to open the rule details form
     * @param {*} page 
     * @param {*} ruleName 
     */
    openTheRuleFormByNameInVersionDetails: async (page, ruleName) => {
        await page.locator('xpath=//div[contains(@class, "akamaiTableRules")]//table/tbody/tr').wait();

        const xpthSearchInput = `xpath=//div[contains(@class, "akamaiTableRules")]//input[@type="search"]`
        await page.locator(xpthSearchInput)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Find the rule by name: '${ruleName}'`)
            })
            .fill(ruleName)

        const matchRule = `xpath=//div[contains(@class, "akamaiTableRules")]//table/tbody/tr[td[contains(@class, "name-column")][contains(string(), "${ruleName}")]]/td[last()]/div`
        await page.locator(matchRule)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to '...' icon to open the menu in the: '${ruleName}' rule row`)
            }).click()

        clickToMenuItemInVersionDetailsPage(page, ruleName, "Edit Rule")
    },

    /**
     * When you are in 'Version Details' page, 
     * 
     * you click to 'Add Rule' button to open the new rule form and fill the basic information
     * 
     * such as rule's name, source url, redirect url, redirect type, isCopyQueryString and relativeRedirectOption
     * @param {*} page 
     * @param {*} ruleName 
     * @param {*} sourceUrl 
     * @param {*} redirectURL 
     * @param {*} redirectType 
     * @param {*} copyQueryString 
     * @param {*} relativeRedirectOption 
     */
    addNewBasicRule: async (page, ruleName, sourceUrl, redirectURL, redirectType, copyQueryString, relativeRedirectOption = undefined) => {
        await page.locator('xpath=//akam-table-toolbar//button[contains(string(), "Add Rule")]')
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to 'Add Rule' button`)
            }).click()

        //fill rule form
        await page.locator(`xpath=//form[@name="ruleForm"]//rule-settings-name//input[@name="ruleName"]`)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Fill the rule name '${ruleName}'`)
            }).fill(ruleName)
        await page.locator(`xpath=//form[@name="ruleForm"]//div[@id="rule-settings-redirect"]//input[@name="sourceURL"]`)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Fill the source URL '${sourceUrl}'`)
            }).fill(sourceUrl)
        await page.locator(`xpath=//form[@name="ruleForm"]//div[@id="rule-settings-redirect"]//input[@name="redirectURL"]`)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Fill the redirect URL '${redirectURL}'`)
            }).fill(redirectURL)
        await page.locator(`xpath=//form[@name="ruleForm"]//div[@id="rule-settings-redirect"]//select[@name="redirectType"]`)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Select the redirect type '${redirectType}'`)
            }).fill(redirectType)

        if (copyQueryString) {
            await page.locator(`xpath=//form[@name="ruleForm"]//div[@id="rule-settings-redirect"]//rule-settings-copy-query-params//input[@type="checkbox"]/following-sibling::div`)
                .on(puppeteer.LocatorEvent.Action, () => {
                    log.white(`Checked to Copy Query String checkbox`)
                })
                .click()
        }

        if (relativeRedirectOption) {
            const xpathRelativeOption = `xpath=//form[@name="ruleForm"]//div[@id="rule-settings-use-relative-url"]//select[@name="relativeURL"]`
            let optionValue = await page.$$eval(`${xpathRelativeOption}/option`, (options, text) => options.find(o => o.innerText === text).value, relativeRedirectOption)
            await page.on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Select Relative Redirect Options: ${optionValue}`)
            }).select(xpathRelativeOption, optionValue);
        }

    },

    /**
     * When you opened the Add Rule form dialog, you can click to show Advanced View
     * @param {*} page 
     */
    showAdvancedViewInRuleForm: async (page) => {
        await page.locator(`xpath=//form[@name="ruleForm"]//div[@id="modalButtonDiv"]//button[contains(@class, "switchDetailView")]`)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Click to 'Show Advanced View'`)
            }).click()
    },

    /**
     * Updates the rule match in the advanced view of the rule form.
     * 
     * @param {object} page - The Puppeteer page object.
     * @param {string} matchName - The name of the match to update.
     * @param {string} matchOperator - The operator of the match to update.
     * @param {string} matchValue - The value of the match to update.
     * @param {number} index - The index of the match in the list.
     * 
     * @returns {Promise<void>}
     */
    updateRuleMatchInAdvancedView: async (page, matchName, matchOperator, matchValue, index) => {
        const matchPath = `xpath=//div[@id="rule_details_advanced"]//div[contains(@class, "updateableList")]/div[${index}]`
        const matchNamePath = `${matchPath}//ng-form//select`
        var optionValue = await page.$$eval(`${matchNamePath}/option`, (options, text) => options.find(o => o.innerText === text).value, matchName)
        await page.select(matchNamePath, optionValue);
        log.white(`Select Rule Match Name: ${matchName}`)

        const matchOperatorPath = `${matchPath}//match-operator//select`
        let operatorOptions = await page.$$eval(`${matchOperatorPath}/option`, (options, text) => options.find(o => o.innerText === text).value, matchOperator)
        await page.select(matchOperatorPath, operatorOptions);
        log.white(`Select Rule Match Operator: ${matchOperator}`)

        const matchValuePath = `${matchPath}//match-multi-value//input[@type="text"]`
        await page.locator(matchValuePath)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Fill the rule match value: ${matchValue}`)
            }).fill(matchValue);
        await page.keyboard.press('Enter')

        //const checkbox1 = `//div[@id="rule_details_advanced"]//div[contains(@class, "updateableList")]/div[1]//match-multi-value//input[@type="checkbox"]/following-sibling::div[contains(string(), "Allow wildcards * (zero or more) and ? (any character)")]`
    },
    
    /**
     * Need to refactor this function to support edit any field in rule form
     * @param {*} page 
     * @param {*} redirectURL 
     */
    editRedirectUrlInRuleForm: async (page, redirectURL) => {
        await page.locator(`xpath=//form[@name="ruleForm"]//div[@id="rule-settings-redirect"]//input[@name="redirectURL"]`)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.white(`Fill the redirect URL '${redirectURL}'`)
            }).fill(redirectURL)
    },

    /**
     * When you are on the Rule form dialog, you can click to 'Save Rule' button to add rule into current version
     * @param {*} page 
     */
    saveRuleInRuleForm: async (page) => {
        await page.locator(`xpath=//div[@id="modalButtonDiv"]//button[@id="saveRule"]`)
            .on(puppeteer.LocatorEvent.Action, () => {
                log.yellow(`Click to 'Save Rule' button`)
            }).click();
    },
}
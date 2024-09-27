const { Cluster } = require('puppeteer-cluster');

/*
1) CONCURRENCY_PAGE: (Multi tabs in on one browser instance, shared same cookies) In this model, each worker in the cluster manages a single page within a browser instance. 
It's suitable for tasks that can operate in the same browser context but need separate pages.

Use case: Suppose you are developing a script to scrape product prices from various e-commerce websites. 
The goal is to open multiple product pages and extract pricing information. Each worker can handle a separate product page within the same browser instance. 
Since all these pages can share the same browser context like cookies from the e-commerce site, this model is efficient.

2) CONCURRENCY_CONTEXT: (Multi tabs in on one browser instance, but not shared same cookies) Here, each worker handles a distinct browser context within the same browser instance. 
This setup is ideal when tasks require isolation from each other but don’t need individual browser instances.

Use case: Imagine a task where you need to scrape data from multiple social media profiles. 
In this case, you need different login sessions. 
This model is perfect for managing multiple login sessions simultaneously. 
Each context can log in to a different account as they can isolate session data like cookies and local storage.

3) CONCURRENCY_BROWSER: (Multi browser instances) In this approach, each worker controls a whole browser instance. 
It provides complete isolation at the browser level. 
This is the most resource-intensive option but provides the highest level of isolation and flexibility.

Use case: This is a suitable model if you want to scrape a website and ensure the information is accurate across different browser types.
*/

(async () => {
    const cluster = await Cluster.launch({
        concurrency: Cluster.CONCURRENCY_PAGE,
        maxConcurrency: 2,
    });

    cluster.task(async ({ page, data: url }) => {
        try {
            await page.goto(url, { timeout: 60000 });
            const title = await page.title();
            console.log(`Title of ${url}: ${title}`);
        } catch (error) {
            /*
                Custom task execution and Error Handling
                Users can also create complex custom task functions with error-handling features for each function. 
                This ensures that tasks are completed on time, without network errors or browser instance crashes. 
                Also, users can customize the retry behavior and timeout thresholds.
            */
            if (error.name === 'TimeoutError') {
                console.error('Navigation timed out, retrying...');
                return cluster.queueTask(data);
            } else {
                console.error('Task failed:', error);
            }
        }
    });

    //We then queue two URLs using cluster.queue. 
    //Puppeteer Cluster will automatically distribute these URLs to the available browser instances. Here, you can queue as many URLs as you want.
    cluster.queue('https://www.wikipedia.org');
    cluster.queue('https://www.github.com');

    //Finally, cluster.idle waits for all queued tasks to be completed,
    await cluster.idle();
    //Then cluster.close shuts down the cluster and closes all browser instances.
    await cluster.close();
})();
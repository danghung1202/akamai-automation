
# Basic setup of Puppeteer cluster

https://www.webshare.io/academy-article/puppeteer-cluster#how-to-install-puppeteer-cluster

In this script, we initialize a new cluster using the Cluster.launch method. We set the concurrency to Cluster.CONCURRENCY_CONTEXT, meaning each browser runs in its own context, similar to incognito sessions. The maxConcurrency option is set to 2, allowing two browser instances to run simultaneously. You can change this number to fit your task.

The cluster.task method defines what each browser instance should do. Here, it goes to a given URL, retrieves the page title, and logs it to the console. You will have to change this logic according to the task at hand.

We then queue two URLs using cluster.queue. Puppeteer Cluster will automatically distribute these URLs to the available browser instances. Here, you can queue as many URLs as you want.

Finally, cluster.idle waits for all queued tasks to be completed, and cluster.close shuts down the cluster and closes all browser instances.
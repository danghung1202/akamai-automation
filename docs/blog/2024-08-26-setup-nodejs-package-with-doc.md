---
slug: setup-nodejs-package-with-doc
title: How To Set Up the Node.js Package project with Docusaurus
tags: [hola, docusaurus]
---


To integrate the Docusaurus documentation site within your Node.js package project and have it under a `docs` folder, you can follow these steps:

### 1. **Set Up the Node.js Package**

1. **Create a new directory:**
   ```bash
   mkdir my-node-package
   cd my-node-package
   ```

2. **Initialize a Node.js project:**
   ```bash
   npm init -y
   ```

3. **Install necessary dependencies:**
   ```bash
   npm install --save-dev jest
   ```

4. **Create a `.gitignore` file:**
   ```bash
   echo "node_modules" > .gitignore
   ```

### 2. **Set Up Docusaurus Inside the `docs` Folder**

1. **Create the Docusaurus project inside the `docs` folder:**
   ```bash
   npx create-docusaurus@latest docs classic
   cd docs
   ```

2. **Update Docusaurus configuration:**
   - Open `docusaurus.config.js` inside the `docs` folder and configure the `url` and `baseUrl` as follows:
   ```javascript
   module.exports = {
     // Other configurations...

     url: 'https://<username>.github.io',
     baseUrl: '/<repo-name>/',
     organizationName: '<username>', // GitHub organization/user name.
     projectName: '<repo-name>', // GitHub repo name.

     // Other configurations...
   };
   ```

### 3. **Set Up GitHub Actions**

1. **Configure GitHub Actions for NPM Publishing**

   - Create a GitHub Actions workflow:
   
   ```bash
   mkdir -p .github/workflows
   touch .github/workflows/publish.yml
   ```

   - Edit the `publish.yml` file:
   ```yaml
   name: Node.js Package

   on:
     push:
       branches:
         - main
       tags:
         - 'v*.*.*'

   jobs:
     release:
       runs-on: ubuntu-latest

       steps:
         - name: Check out the code
           uses: actions/checkout@v3

         - name: Set up Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             registry-url: 'https://registry.npmjs.org'
             cache: 'npm'

         - name: Install dependencies
           run: npm install

         - name: Run tests
           run: npm test

         - name: Publish to npm
           run: npm publish
           env:
             NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```

   **Note:** Ensure you add your `NPM_TOKEN` as a secret in your GitHub repository. Following this link https://stackoverflow.com/questions/70631423/github-action-for-npm-publish-fails to get correct NPM secret

2. **Configure GitHub Actions to Deploy Docusaurus Documentation**

   - Add another workflow file for deploying Docusaurus documentation:

   ```bash
   touch .github/workflows/deploy-docs.yml
   ```

   - Edit the `deploy-docs.yml` file:
   ```yaml
   name: Deploy Docusaurus Documentation

   on:
     push:
       branches:
         - main

   jobs:
     build:
       runs-on: ubuntu-latest

       steps:
         - name: Check out the code
           uses: actions/checkout@v3

         - name: Set up Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'

         - name: Install dependencies
           run: cd docs && npm install

         - name: Build the site
           run: cd docs && npm run build

         - name: Deploy to GitHub Pages
           run: cd docs && GIT_USER=<username> npm run deploy
           env:
             GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
   ```

   **Note:** Replace `<username>` and `<repo-name>` with your GitHub username and repository name.

### 4. **Commit, Push, and Deploy**

1. **Add all files:**
   ```bash
   git add .
   git commit -m "Set up Node.js package, GitHub Actions, and Docusaurus documentation"
   ```

2. **Push to GitHub:**
   ```bash
   git push origin main
   ```

### Final Structure

Your project structure should look like this:

```
my-node-package/
│
├── .github/
│   └── workflows/
│       ├── publish.yml
│       └── deploy-docs.yml
│
├── docs/
│   ├── docusaurus.config.js
│   ├── src/
│   ├── static/
│   ├── ...
│
├── node_modules/
│
├── .gitignore
├── package.json
└── README.md
```

With this setup:

- The Node.js package will be automatically published to npm when you push a new tag matching the pattern `v*.*.*`.
- Documentation will be automatically built and deployed to GitHub Pages when changes are pushed to the `main` branch.
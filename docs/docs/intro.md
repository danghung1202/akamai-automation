---
sidebar_position: 1
---

# Akamai Automation Tool

This project is a Puppeteer-based automation tool designed to automate configuration tasks in the Akamai CDN platform, specifically targeting Akamai Property Manager. The tool leverages Puppeteer for browser automation, enabling seamless interaction with Akamai's web interface to manage rules, behaviors, criteria, and other configuration components.

## Features

- **Automate Property Manager Tasks**: Create, update, and manage property configurations, including rules, behaviors, and criteria.
- **Behavior Management**: Automatically check for, add, or update behaviors within property rules.
- **Version Control**: Navigate through different property versions, create new versions based on staging or production, and manage draft versions.
- **Detailed Logging**: Includes comprehensive logging to track all actions performed by the automation scripts.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/danghung1202/akamai-automation.git
   cd akamai-automation
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

1. **Setup**: Ensure you have access to Akamai's Property Manager and the necessary credentials for logging in.

2. **Run the automation scripts**:
   - You can run individual scripts or create custom scripts to automate specific tasks. For example, to check if a behavior exists in a property:
   ```javascript
   const puppeteer = require('puppeteer');
   const { checkHasBehaviorByName } = require('./path/to/your/module');

   (async () => {
       const browser = await puppeteer.launch({ headless: false });
       const page = await browser.newPage();

       // Navigate to the Akamai Property Manager login page and log in
       await page.goto('https://control.akamai.com');

       // Perform the task
       const hasBehavior = await checkHasBehaviorByName(page, 'Behavior Name');
       console.log(`Behavior exists: ${hasBehavior}`);

       await browser.close();
   })();
   ```

3. **Documentation**: Detailed documentation for each method is available in the `docs` directory. You can also generate a Docusaurus site to browse the documentation more easily.

## Project Structure

- `src/`: Contains the core automation scripts.
- `docs/`: Documentation files for the functions in this project.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the file for details.

## Support

If you encounter any issues or have questions, feel free to open an issue on GitHub.

---

### Disclaimer

This tool is intended for use by authorized users of Akamai's CDN platform. Please ensure you have the necessary permissions to perform automated tasks on your Akamai account.
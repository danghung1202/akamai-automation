"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3976],{619:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>u,frontMatter:()=>s,metadata:()=>o,toc:()=>c});var i=t(4848),a=t(8453);const s={slug:"/",sidebar_position:1},r="Akamai Automation Tool",o={id:"intro",title:"Akamai Automation Tool",description:"This project is a Puppeteer-based automation tool designed to automate configuration tasks in the Akamai CDN platform, specifically targeting Akamai Property Manager. The tool leverages Puppeteer for browser automation, enabling seamless interaction with Akamai's web interface to manage rules, behaviors, criteria, and other configuration components.",source:"@site/docs/intro.md",sourceDirName:".",slug:"/",permalink:"/akamai-automation/",draft:!1,unlisted:!1,editUrl:"https://github.com/danghung1202/akamai-automation/tree/main/docs/docs/intro.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{slug:"/",sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Tutorial - Basics",permalink:"/akamai-automation/category/tutorial---basics"}},l={},c=[{value:"Features",id:"features",level:2},{value:"Installation",id:"installation",level:2},{value:"Usage",id:"usage",level:2},{value:"Project Structure",id:"project-structure",level:2},{value:"Contributing",id:"contributing",level:2},{value:"License",id:"license",level:2},{value:"Support",id:"support",level:2},{value:"Disclaimer",id:"disclaimer",level:3}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",hr:"hr",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"akamai-automation-tool",children:"Akamai Automation Tool"})}),"\n",(0,i.jsx)(n.p,{children:"This project is a Puppeteer-based automation tool designed to automate configuration tasks in the Akamai CDN platform, specifically targeting Akamai Property Manager. The tool leverages Puppeteer for browser automation, enabling seamless interaction with Akamai's web interface to manage rules, behaviors, criteria, and other configuration components."}),"\n",(0,i.jsx)(n.h2,{id:"features",children:"Features"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Automate Property Manager Tasks"}),": Create, update, and manage property configurations, including rules, behaviors, and criteria."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Behavior Management"}),": Automatically check for, add, or update behaviors within property rules."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Version Control"}),": Navigate through different property versions, create new versions based on staging or production, and manage draft versions."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.strong,{children:"Detailed Logging"}),": Includes comprehensive logging to track all actions performed by the automation scripts."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Clone the repository:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"git clone https://github.com/danghung1202/akamai-automation.git\ncd akamai-automation\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"Install the dependencies:"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-bash",children:"npm install\n"})}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Setup"}),": Ensure you have access to Akamai's Property Manager and the necessary credentials for logging in."]}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Run the automation scripts"}),":"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsx)(n.li,{children:"You can run individual scripts or create custom scripts to automate specific tasks. For example, to check if a behavior exists in a property:"}),"\n"]}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-javascript",children:"const puppeteer = require('puppeteer');\nconst { checkHasBehaviorByName } = require('./path/to/your/module');\n\n(async () => {\n    const browser = await puppeteer.launch({ headless: false });\n    const page = await browser.newPage();\n\n    // Navigate to the Akamai Property Manager login page and log in\n    await page.goto('https://control.akamai.com');\n\n    // Perform the task\n    const hasBehavior = await checkHasBehaviorByName(page, 'Behavior Name');\n    console.log(`Behavior exists: ${hasBehavior}`);\n\n    await browser.close();\n})();\n"})}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"Documentation"}),": Detailed documentation for each method is available in the ",(0,i.jsx)(n.code,{children:"docs"})," directory. You can also generate a Docusaurus site to browse the documentation more easily."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"project-structure",children:"Project Structure"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"src/"}),": Contains the core automation scripts."]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"docs/"}),": Documentation files for the functions in this project."]}),"\n"]}),"\n",(0,i.jsx)(n.h2,{id:"contributing",children:"Contributing"}),"\n",(0,i.jsx)(n.p,{children:"Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes."}),"\n",(0,i.jsx)(n.h2,{id:"license",children:"License"}),"\n",(0,i.jsx)(n.p,{children:"This project is licensed under the MIT License - see the file for details."}),"\n",(0,i.jsx)(n.h2,{id:"support",children:"Support"}),"\n",(0,i.jsx)(n.p,{children:"If you encounter any issues or have questions, feel free to open an issue on GitHub."}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"disclaimer",children:"Disclaimer"}),"\n",(0,i.jsx)(n.p,{children:"This tool is intended for use by authorized users of Akamai's CDN platform. Please ensure you have the necessary permissions to perform automated tasks on your Akamai account."})]})}function u(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>o});var i=t(6540);const a={},s=i.createContext(a);function r(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);
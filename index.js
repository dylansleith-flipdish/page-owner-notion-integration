const exportUsersToExcel = require('./utils/exportToExcel.js');
const { Client } = require('@notionhq/client');

require('dotenv').config();

// Initialize client
const notion = new Client({
  auth: process.env.NOTION_TOKEN
});

(async () => {
  // Search for all pages
  const pages = await notion.search({
    filter: {
      value: 'page',
      property: 'object'
    }
  });

  // Get author id's of page
  let pagesResponse = pages.results.map((response) => ({
    author: response.created_by.id
  }));

  for (let i = 0; i < pagesResponse.length; i++) {
    // Get author id
    let userIds = pagesResponse.map((x) => x.author);

    // Get user information based on id
    const res = await notion.users.retrieve({
      user_id: userIds[i]
    });

    // Output for excel
    let pageOwnersOutput = pages.results.map((response) => ({
      author: res.name,
      pageUrl: response.url
    }));

    const workSheetColumnName = ['Author', 'Page'];

    const workSheetName = 'PageOwners';

    const filePath = './output/page-owners.xlsx';

    exportUsersToExcel(pageOwnersOutput, workSheetColumnName, workSheetName, filePath);
  }
})();

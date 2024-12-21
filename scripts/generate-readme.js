const fs = require('fs');
const path = require('path');
const generateTemplate = require('./readme-template.js');

// Read the projects data
const projectsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../projects.json'), 'utf8'));

// Generate and write the new README
const readmeContent = generateTemplate(projectsData);
fs.writeFileSync(path.join(__dirname, '../README.md'), readmeContent);

console.log('README.md has been generated successfully!'); 
const fs = require('fs');
const path = require('path');

// Read the source projects.json
const projectsData = fs.readFileSync(path.join(__dirname, '../projects.json'), 'utf8');

// Write to web/src/data directory
const targetDir = path.join(__dirname, '../web/src/data');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

fs.writeFileSync(path.join(targetDir, 'projects.json'), projectsData);

console.log('Projects data has been synced to web/src/data/projects.json'); 
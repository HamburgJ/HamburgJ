const generateTemplate = (data) => `<h1 align="center">
  <a href="#" style="text-decoration: none; font-size: 60px; font-weight: 700;">
    Joshua Hamburger
  </a>
</h1>

<h2 align="center">
  <a href="#" style="text-decoration: none; font-size: 30px; font-weight: 100;">
    Projects
  </a>
</h2>

<div align="center" style="margin: 30px 0">
${data.projects.map(project => `
  <div style="background: #1a1b27; padding: 20px; border-radius: 10px; margin: 20px 0; display: flex; align-items: center; justify-content: space-between;">
    <div style="flex: 1; padding-right: 20px;">
      <h3 style="color: ${project.color}; font-size: 24px; margin-bottom: 10px;">${project.name}</h3>
      <p style="font-size: 16px; margin: 15px 0;">${project.description}</p>
    </div>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <a href="${project.liveUrl}" target="_blank">
        <img src="https://img.shields.io/badge/${project.actionText.replace(/ /g, '_')}-${project.color.replace('#', '')}?style=for-the-badge&logo=react&logoColor=white" alt="${project.actionText}" height="40">
      </a>
      <a href="${project.repoUrl}" target="_blank">
        <img src="https://img.shields.io/badge/View_Code-2a2e3b?style=for-the-badge&logo=github&logoColor=white" alt="View Code" height="40">
      </a>
    </div>
  </div>`).join('\n')}
</div>

<br>
<div align="center">
  <a href="${data.socialLinks.linkedin}" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn">
  </a>
</div>
<br>

<div align="center">
  <img width="50%" src="https://github-readme-stats.vercel.app/api/top-langs/?username=HamburgJ&theme=radical&hide=html,css&layout=compact&langs_count=6&bg_color=101010&hide_title=true">
</div>
<br>
<div align="center" style="margin-top: 20px;">
  <img src="https://komarev.com/ghpvc/?username=HamburgJ&color=DD6387&style=for-the-badge">
</div>`;

module.exports = generateTemplate; 
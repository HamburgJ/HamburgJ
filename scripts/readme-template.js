const generateTemplate = (data) => {
  // Map from projects.json names to showcase card config
  const gameConfig = {
    'Infinite Levels!': { emoji: '∞', bgcolor: '#3730A3', badgeColor: '4F46E5', action: 'PLAY', desc: 'A recursive descent into mathematical madness. Every level reveals another. There is no end.' },
    'Match Five':      { emoji: '🧩', bgcolor: '#6B21A8', badgeColor: '8B5CF6', action: 'PLAY', desc: 'One word. Five meanings. Vocabulary meets lateral thinking. No clutter. Just words.' },
  };
  const projectConfig = {
    'PlantGuru':       { emoji: '🌱', bgcolor: '#14532D', badgeColor: '22C55E', action: 'EXPLORE', desc: 'IoT-powered botanical intelligence. Cloud-predicted watering schedules. Sensor-verified vibes. UWaterloo Capstone.' },
    'Survivor Stats':  { emoji: '📊', bgcolor: '#7C2D12', badgeColor: 'F97316', action: 'TRY IT', desc: 'The tribe has spoken — and it said "give me a database." 50 seasons of blindsides, alliances, and immunity idols.' },
  };

  const games = data.projects.filter(p => p.name in gameConfig);
  const projects = data.projects.filter(p => p.name in projectConfig);

  const gameCards = games.map(p => {
    const c = gameConfig[p.name];
    return `<td align="center" bgcolor="${c.bgcolor}" width="220">
<br>
<h1>${c.emoji}</h1>
<h3>${p.name.replace('!', '')}</h3>
<p>${c.desc}</p>
<a href="${p.liveUrl}"><img src="https://img.shields.io/badge/▶_${c.action}-${c.badgeColor}?style=flat-square" alt="${c.action}"></a>
<a href="${p.repoUrl}"><img src="https://img.shields.io/badge/Code-24292e?style=flat-square&logo=github&logoColor=white" alt="Code"></a>
<br><br>
</td>`;
  }).join('\n');

  const projectCards = projects.map(p => {
    const c = projectConfig[p.name];
    return `<td align="center" bgcolor="${c.bgcolor}" width="340">
<br>
<h3>${c.emoji} ${p.name}</h3>
<p>${c.desc}</p>
<a href="${p.liveUrl}"><img src="https://img.shields.io/badge/${c.action.replace(/ /g, '_')}-${c.badgeColor}?style=flat-square" alt="${c.action}"></a>
<a href="${p.repoUrl}"><img src="https://img.shields.io/badge/Code-24292e?style=flat-square&logo=github&logoColor=white" alt="Code"></a>
<br><br>
</td>`;
  }).join('\n');

  return `<div align="center">

![header](https://capsule-render.vercel.app/api?type=venom&color=0:0d1117,100:161b22&height=220&text=Josh%20Hamburger&fontSize=46&fontColor=58a6ff&animation=fadeIn&fontAlignY=32&desc=you%20found%20my%20github%20page.%20congratulations.&descSize=16&descAlignY=55&descColor=8b949e)

🍔 Prompt Engineer at [Expertise AI](https://www.expertise.ai/). ECE UWaterloo 2025.

<br>

<a href="https://www.expertise.ai/">
<img src="https://img.shields.io/badge/🤖_Try_My_AI-161b22?style=for-the-badge&logoColor=white" alt="Try My AI" height="40">
</a>

<a href="${data.socialLinks.linkedin}">
<img src="https://img.shields.io/badge/💼_Connect_on_LinkedIn-161b22?style=for-the-badge&logoColor=white" alt="LinkedIn" height="40">
</a>

<a href="https://hamburgj.github.io/HamburgJ/">
<img src="https://img.shields.io/badge/Portfolio-fcfbf9?style=for-the-badge&logo=safari&logoColor=333" alt="Portfolio">
</a>

</div>

---

<h3 align="center">G A M E S</h3>

<table align="center">
<tr>
${gameCards}
</tr>
</table>

---

<h3 align="center">P R O J E C T S</h3>

<table align="center">
<tr>
${projectCards}
</tr>
</table>

---

<h3 align="center">P O R T F O L I O</h3>

<table align="center">
<tr>
<td align="center" bgcolor="#161b22" width="680">
<br>
<h3>🍔 hamburgj.github.io</h3>
<p>My interactive portfolio site. Poke around — there's more than meets the eye.</p>
<a href="https://hamburgj.github.io/HamburgJ/"><img src="https://img.shields.io/badge/VISIT-58a6ff?style=for-the-badge" alt="Visit"></a>
<br><br>
</td>
</tr>
</table>`;
};

module.exports = generateTemplate; 
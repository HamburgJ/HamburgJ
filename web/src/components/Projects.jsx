import React from 'react';
import ParticleBackground from './ParticleBackground';

const projectData = [
  {
    title: "Veggie Buddy",
    image: "/images/veggiebuddy.png",
    description: "Veggie Buddy is a webapp that scrapes and compares local grocery flyers to find the best food deals. It detects different grocery items by scraping flyers, then aggregates and sorts them intelligently for easy browsing. Built with Python back-to-front and MongoDB.",
    links: [
      { text: "Website", url: "https://veggie-buddy.herokuapp.com" },
      { text: "Github", url: "https://github.com/HamburgJ/Veggie-Buddy" }
    ]
  },
  {
    title: "Premium Golf 2",
    image: "/images/pg2.png",
    description: "A 2D platforming game where you aim and shoot your way to victory! Made in Python with Pygame.",
    links: [
      { text: "Github", url: "https://github.com/HamburgJ/Premium-Golf-2" }
    ]
  },
  {
    title: "Stronghold Finder",
    image: "/images/stronghold_finder.png",
    description: "An app that approximates the location of strongholds in Minecraft worlds via triangulation. Made in Android Studio with Java.",
    links: [
      { text: "Google Play", url: "https://play.google.com/store/apps/details?id=com.hamburgj.strongholdfinder" },
      { text: "Github", url: "https://github.com/HamburgJ/Stronghold-Finder" }
    ]
  },
  {
    title: "Wrap Bot",
    image: "/images/wrapbotimg.png",
    description: "A discord bot that allows users to play a custom puzzle game called \"Wrap\" in the discord app. Made in Java with Java Discord API.",
    links: [
      { text: "Github", url: "https://github.com/HamburgJ/Wrap-Bot" }
    ]
  },
  {
    title: "Planet Zero",
    image: "/images/planet_zero.png",
    description: "An action-packed resource management game set in space! Collect resources and water while avoiding asteroids as you orbit the sun. Made in GameMaker Studio.",
    links: [
      { text: "Itch.io", url: "https://hamburgj.itch.io/planet-zero" },
      { text: "Github", url: "https://github.com/HamburgJ/Planet-Zero" }
    ]
  },
  {
    title: "Eternal Frost",
    image: "/images/eternal_frost.png",
    description: "A creepy RPG game where you travel through a frosty world while avoiding enemies. Made in GameMaker Studio.",
    links: [
      { text: "Itch.io", url: "https://hamburgerj.itch.io/eternal-frost" }
    ]
  },
  {
    title: "Premium Golf 3",
    image: "/images/pg3.png",
    description: "A simulated 3D golfing game made in Flash with ActionScript.",
    links: [
      { text: "Itch.io", url: "https://hamburgj.itch.io/premium-golf-3" },
      { text: "Github", url: "https://github.com/HamburgJ/Premium-Golf-3" }
    ]
  }
];

function Projects() {
  return (
    <div className="main-long">
      <ParticleBackground />
      <div className="featured-container">
        <h1>Projects</h1>
      </div>
      {projectData.map((project, index) => (
        <div className="project-card-container" key={index}>
          <div className="project-card-inside">
            <div className="project-card">
              <img src={project.image} alt={project.title} />
              <div className="text-container">
                <div className="header-container">
                  <h1>{project.title}</h1>
                  <div className="button-container">
                    {project.links.map((link, linkIndex) => (
                      <button className="main-btn" key={linkIndex}>
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.text}
                        </a>
                      </button>
                    ))}
                  </div>
                </div>
                <h2>{project.description}</h2>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Projects; 
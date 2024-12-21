import React from 'react';
import Sketch from 'react-p5';

class Particle {
  constructor(p5) {
    this.pos = p5.createVector(p5.random(p5.width), p5.random(p5.height));
    this.vel = p5.createVector(p5.random(-1, 1), p5.random(-3, -0.2));
    this.shrink = p5.random(0.7, 0.9);
    this.size = p5.random(300, 400) + this.shrink * ((p5.height - this.pos.y) / this.vel.y);
    this.p5 = p5;
  }

  update() {
    this.pos.add(this.vel);
    this.size -= this.shrink;

    if (this.pos.y < -this.size || this.size <= 0) {
      this.respawn();
    }
    if (this.pos.x < -this.size) {
      this.pos.x = this.p5.width + this.size;
    }
    if (this.pos.x > this.p5.width + this.size) {
      this.pos.x = -this.size;
    }
  }

  respawn() {
    this.size = this.p5.random(300, 400);
    this.vel = this.p5.createVector(this.p5.random(-1, 1), this.p5.random(-3, -0.2));
    this.pos = this.p5.createVector(this.p5.random(this.p5.width), this.p5.random(this.p5.height + 100, this.p5.height + 300));
    this.shrink = this.p5.random(0.5, 0.8);
  }

  draw() {
    this.p5.fill(135, 123, 82);
    this.p5.circle(this.pos.x, this.pos.y, this.size);
  }
}

function ParticleBackground() {
  let particles = [];

  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
    const particlesLength = Math.floor(window.innerWidth / 10);
    
    for (let i = 0; i < particlesLength; i++) {
      particles.push(new Particle(p5));
    }
    p5.noStroke();
  };

  const draw = p5 => {
    p5.background(156, 142, 95);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
  };

  const windowResized = p5 => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }}>
      <Sketch setup={setup} draw={draw} windowResized={windowResized} />
    </div>
  );
}

export default ParticleBackground; 
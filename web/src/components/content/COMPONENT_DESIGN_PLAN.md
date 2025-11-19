# Component Design Plan: "The Digital Museum"

This plan details the unique design, interaction, and functionality for each experience and project component within the retro file system portfolio. The goal is to make each "file" feel like a distinct mini-application or digital artifact.

## 1. Education: University of Waterloo
**Concept**: "The Engineering Blueprint"
- **Visual Style**: Dark blue background with white grid lines and "hand-drawn" white text/lines (Blueprint aesthetic).
- **Layout**: A "Skill Tree" or "Course Map" visualization.
- **Interaction**:
    -   **Pan & Zoom**: The user can drag to pan around the blueprint.
    -   **Nodes**: Courses are represented as nodes. Hovering a node highlights its prerequisites (connected lines). Clicking a node opens a "Detail Spec" modal with the course description and grade.
- **Content**:
    -   "System Specs" (Degree info).
    -   "Performance Metrics" (Dean's Honours).
    -   "Core Modules" (Key coursework).

## 2. Experience: Expertise AI
**Concept**: "The Neural Terminal"
- **Visual Style**: Cyberpunk/Hacker terminal. Black background, glowing green text, CRT scanline effects.
- **Layout**: A split screen. Left: Command Line Interface (CLI). Right: "Visual Output" area.
- **Interaction**:
    -   **CLI**: Users can type commands like `> query role`, `> analyze stack`, `> run impact_report`.
    -   **Auto-Type**: A "Run Demo" button for users who don't want to type.
- **Content**:
    -   Job description is revealed as "system logs" or "analysis results".
    -   "Building the future of AI" is the MOTD (Message of the Day).

## 3. Experience: Descartes Systems Group
**Concept**: "The Logistics Map"
- **Visual Style**: A stylized, pixel-art world map.
- **Layout**: Full-screen map with a side panel for "Manifest Details".
- **Interaction**:
    -   **Live Tracking**: Animated "packages" (dots) moving between cities.
    -   **Inspect**: Clicking a moving package pauses it and opens its "Manifest" in the side panel.
    -   **Manifest**: The manifest contains a bullet point of my work experience there (e.g., "Optimized route algorithm").
- **Content**:
    -   "Shipment ID: INTERN-2024"
    -   "Status: DELIVERED"

## 4. Experience: CharityCAN
**Concept**: "The Analytics Dashboard"
- **Visual Style**: Clean, modern SaaS dashboard. White/Light Grey background, crisp borders, data visualization colors (blues, teals).
- **Layout**: A grid of "Widgets" (Charts, Graphs, KPI Cards).
- **Interaction**:
    -   **Interactive Charts**: Hovering over bar charts reveals tooltips with specific achievements.
    -   **Filters**: Toggle buttons to switch data views (e.g., "Frontend", "Backend", "Data").
- **Content**:
    -   "Donor Management" -> Represented as a network graph.
    -   "Fundraising Analytics" -> Represented as a rising bar chart.

## 5. Experience: Cadence Agriculture Systems
**Concept**: "The IoT Control Panel"
- **Visual Style**: Industrial Interface. Brushed metal textures, toggle switches, LED indicators, analog gauges.
- **Layout**: A control panel with labeled sections (Embedded, Web, Hardware).
- **Interaction**:
    -   **Switches**: Flipping a switch (e.g., "ENABLE_WEB_INTERFACE") lights up an LED and reveals that section of the text on a digital LCD display.
    -   **Gauges**: "System Load" gauge that reacts to mouse movement.
- **Content**:
    -   Text is displayed on a simulated dot-matrix or 7-segment display.

## 6. Experience: Quilt.AI
**Concept**: "The Pattern Weaver"
- **Visual Style**: Abstract, artistic data visualization. A "quilt" of connecting nodes or images.
- **Layout**: A floating network of nodes.
- **Interaction**:
    -   **Physics**: Nodes float and bounce gently. Mouse interaction pushes them away or pulls them close.
    -   **Connection**: Clicking a node draws connections to related skills (e.g., "ML" connects to "Python" and "Data Analysis").
- **Content**:
    -   Each node represents a skill or achievement.

## 7. Project: Grocery Buddy
**Concept**: "The Supermarket Receipt"
- **Visual Style**: A long, vertical, crinkled paper receipt on a wooden table background.
- **Layout**: Single column text, monospaced "receipt" font.
- **Interaction**:
    -   **Tear Off**: A button to "tear" the receipt (animation), which prints a new one with different info (e.g., Tech Stack vs. Features).
    -   **Barcode**: A barcode at the bottom that, when hovered, shows the GitHub link.
- **Content**:
    -   "Items" purchased are actually features (e.g., "1x Price Tracking......$0.00").

## 8. Project: Infinite Levels
**Concept**: "The Infinite Zoom"
- **Visual Style**: Recursive geometry.
- **Layout**: A central frame that contains a copy of itself, infinitely.
- **Interaction**:
    -   **Scroll to Zoom**: Scrolling moves the user "into" the next level.
    -   **Levels**: Each "level" (zoom depth) reveals a different paragraph of text about the project.
- **Content**:
    -   Level 1: Intro. Level 2: Tech Stack. Level 3: Challenges.

## 9. Project: Match Five
**Concept**: "The Word Grid"
- **Visual Style**: Scrabble/Wordle inspired grid.
- **Layout**: A 5x5 grid of letter tiles.
- **Interaction**:
    -   **Playable**: The user can actually drag letters to form words.
    -   **Easter Eggs**: Forming specific words (like "REACT", "GAME") unlocks the project description.
    -   **Solve**: A "Solve" button automatically animates the tiles to spell out the project name.
- **Content**:
    -   The "Definitions" of the words formed describe the project.

## 10. Project: Four Nines
**Concept**: "The Chalkboard"
- **Visual Style**: Green chalkboard texture, white chalk font.
- **Layout**: Mathematical equations written on the board.
- **Interaction**:
    -   **Eraser**: The mouse cursor becomes an eraser. The user can "erase" the initial equation to reveal the hidden project details underneath.
    -   **Chalk**: Click to "write" (adds simple doodles or underlines).
- **Content**:
    -   Initial: "9 + 9 + 9 + 9 = ?"
    -   Revealed: "A daily math puzzle game..."


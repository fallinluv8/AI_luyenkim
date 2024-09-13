const canvas = document.getElementById('tspCanvas');
const ctx = canvas.getContext('2d');

const cities = [
  { name: 'A', x: 100, y: 200 },
  { name: 'B', x: 300, y: 100 },
  { name: 'C', x: 500, y: 200 },
  { name: 'D', x: 400, y: 400 },
  { name: 'E', x: 200, y: 400 },
];

// Distances matrix
const distances = [
  [0, 9, 8, 14, 14], // A
  [9, 0, 22, 10, 15], // B
  [8, 22, 0, 8, 4], // C
  [14, 10, 8, 0, 19], // D
  [14, 15, 4, 19, 0], // E
];

function drawCities() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'blue';
  cities.forEach((city) => {
    ctx.beginPath();
    ctx.arc(city.x, city.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillText(city.name, city.x + 10, city.y);
  });
}

function drawInitialPaths() {
  ctx.strokeStyle = 'gray';
  ctx.font = '15px Arial';
  for (let i = 0; i < cities.length; i++) {
    for (let j = i + 1; j < cities.length; j++) {
      ctx.beginPath();
      ctx.moveTo(cities[i].x, cities[i].y);
      ctx.lineTo(cities[j].x, cities[j].y);
      ctx.stroke();
      const midX = (cities[i].x + cities[j].x) / 2;
      const midY = (cities[i].y + cities[j].y) / 2;
      ctx.fillText(distances[i][j], midX, midY);
    }
  }
}

function drawPath(path) {
  ctx.strokeStyle = 'red';
  ctx.font = '15px Arial';
  ctx.beginPath();
  ctx.moveTo(cities[path[0]].x, cities[path[0]].y);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(cities[path[i]].x, cities[path[i]].y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cities[path[i]].x, cities[path[i]].y);
  }
  ctx.lineTo(cities[path[0]].x, cities[path[0]].y);
  ctx.stroke();
}

function calculateDistance(path) {
  let distance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    distance += distances[path[i]][path[i + 1]];
  }
  // Add the distance from last city back to the start
  distance += distances[path[path.length - 1]][path[0]];
  return distance;
}

function permute(arr) {
  let results = [];
  if (arr.length === 1) {
    return [arr];
  }
  for (let i = 0; i < arr.length; i++) {
    const current = arr.slice();
    const next = current.splice(i, 1);
    const perms = permute(current);
    for (let j = 0; j < perms.length; j++) {
      results.push(next.concat(perms[j]));
    }
  }
  return results;
}

async function solveTSP() {
  const start = parseInt(document.getElementById('start').value);
  const n = cities.length;
  let shortestPath = [];
  let minDistance = Infinity;

  // Create array of city indexes except the start city
  const cityIndexes = Array.from({ length: n }, (_, i) => i);
  const otherCities = cityIndexes.filter((i) => i !== start);
  const permutations = permute(otherCities);

  // Check all permutations of cities
  for (const path of permutations) {
    const fullPath = [start, ...path, start]; // path starts and ends at 'start'
    const distance = calculateDistance(fullPath);
    if (distance < minDistance) {
      minDistance = distance;
      shortestPath = fullPath;
    }
  }

  console.log(
    'Shortest Path:',
    shortestPath.map((i) => cities[i].name).join(' -> ')
  );
  console.log('Total Distance:', minDistance);

  // Draw cities and initial paths
  drawCities();
  drawInitialPaths();

  // Draw shortest path
  for (let i = 0; i < shortestPath.length - 1; i++) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay for visual effect
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(cities[shortestPath[i]].x, cities[shortestPath[i]].y);
    ctx.lineTo(cities[shortestPath[i + 1]].x, cities[shortestPath[i + 1]].y);
    ctx.stroke();
  }
}

// Initialize the drawing
drawCities();
drawInitialPaths();

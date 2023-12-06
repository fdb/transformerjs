let umap;
let nEpochs;
let viewScale = 40;
let viewX = 0;
let viewY = 0;
let json;
let done = false;

async function setup() {
  const res = await fetch("embeddings.json");
  json = await res.json();
  console.log(json);
  console.log("setup");
  createCanvas(800, 800);
  randomSeed(1);
  umap = new UMAP({
    nNeighbors: 15,
    minDist: 0.1,
    nComponents: 2,
    random: random,
  });
  nEpochs = umap.initializeFit(json.embeddings.map((e) => e.embedding));
}

function draw() {
  if (!umap) return;
  translate(width / 2 + viewX, height / 2 + viewY);
  //   scale(viewScale);
  //   translate(-width / 2 + viewX, -height / 2 + viewY);

  //   translate(width / 2 + tx, height / 2 + ty);
  background(220);
  fill(0);
  noStroke();

  if (!done) {
    umap.step();
    if (umap.step() === nEpochs) {
      done = true;
    }
  }

  const projections = umap.getEmbedding();
  // Find the range of the projections
  const minX = Math.min(...projections.map((p) => p[0]));
  const maxX = Math.max(...projections.map((p) => p[0]));
  const minY = Math.min(...projections.map((p) => p[1]));
  const maxY = Math.max(...projections.map((p) => p[1]));
  //   console.log(projections);
  for (let i = 0; i < projections.length; i++) {
    // const x = map(projections[i][0], minX, maxX, -200, 200);
    // const y = map(projections[i][1], minY, maxY, -200, 200);

    const x = projections[i][0] * viewScale;
    const y = projections[i][1] * viewScale;

    const name = json.embeddings[i].name;
    ellipse(x, y, 5, 5);
    if (viewScale > 2.0) {
      textAlign(CENTER, CENTER);
      text(name, x, y + 10);
    }
  }
}

function keyPressed() {
  const shiftPressed = keyIsDown(SHIFT);
  const delta = shiftPressed ? 100 : 10;
  // Key codes: https://keycode.info/
  if (keyCode === UP_ARROW) {
    ty += delta;
  } else if (keyCode === DOWN_ARROW) {
    ty -= delta;
  } else if (keyCode === LEFT_ARROW) {
    tx += delta;
  } else if (keyCode === RIGHT_ARROW) {
    tx -= delta;
  } else if (keyCode === 61) {
    // +
    scale += delta;
  } else if (keyCode === 173) {
    // -
    scale -= delta;
  }
}

function mouseWheel(event) {
  // Calculate the zoom factor
  let zoomFactor = 1 + event.delta * -0.005; // Adjust the sensitivity as needed

  // Adjust viewX and viewY to zoom around the mouse position
  // The mouse position should be adjusted to the current view
  let mouseXInView = (mouseX - width / 2 - viewX) / viewScale;
  let mouseYInView = (mouseY - height / 2 - viewY) / viewScale;

  // Update the scale
  viewScale *= zoomFactor;

  // Update viewX and viewY based on the new scale
  viewX = -mouseXInView * viewScale + mouseX - width / 2;
  viewY = -mouseYInView * viewScale + mouseY - height / 2;

  return false; // Prevent default scrolling
}

function mouseDragged() {
  viewX += mouseX - pmouseX;
  viewY += mouseY - pmouseY;
}

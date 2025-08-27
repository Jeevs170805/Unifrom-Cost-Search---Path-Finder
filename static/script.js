// script.js — fetch UCS steps and allow step-by-step exploration + follow final path

const computeBtn = document.getElementById("computeBtn");
const nextBtn = document.getElementById("nextBtn");
const regenBtn = document.getElementById("regenBtn");
const info = document.getElementById("info");
const gridEl = document.getElementById("grid");

let steps = [];      // UCS steps from server
let path = [];       // final optimal path (list of [r,c])
let stepIndex = 0;   // current index in steps[]
let followingPath = false; // when true, Next Step moves along final path
let pathIndex = 0;

function cellAt(r,c){
  return gridEl.querySelector(`.cell[data-r='${r}'][data-c='${c}']`);
}

function clearVisuals(){
  gridEl.querySelectorAll(".cell").forEach(cell=>{
    cell.classList.remove("frontier","explored","best","path");
    // reset numeric labels (g)
    if (!cell.classList.contains("obstacle") && !cell.classList.contains("start") && !cell.classList.contains("goal")){
      cell.textContent = "";
    }
  });
}

function renderStep(step){
  clearVisuals();
  // mark explored
  step.explored.forEach(p=>{
    const [r,c] = p;
    const cell = cellAt(r,c);
    if (cell && !cell.classList.contains("start") && !cell.classList.contains("goal")){
      cell.classList.add("explored");
      cell.textContent = ""; // explored we don't show g here
    }
  });

  // show frontier candidates with their costs
  step.frontier.forEach(item=>{
    const [r,c] = item.pos;
    const cell = cellAt(r,c);
    if (cell && !cell.classList.contains("start") && !cell.classList.contains("goal")){
      cell.classList.add("frontier");
      cell.textContent = item.cost; // g(n)
    }
  });

  // highlight current popped node (best)
  const cur = step.current;
  const curCell = cellAt(cur[0], cur[1]);
  if (curCell){
    curCell.classList.add("best");
    curCell.textContent = step.cost;
  }

  info.textContent = `Step ${stepIndex+1}/${steps.length} — popped ${JSON.stringify(step.current)} with cost=${step.cost}`;
}

function renderFinalPath(){
  // show whole path in path color
  clearVisuals();
  path.forEach(p=>{
    const [r,c] = p;
    const cell = cellAt(r,c);
    if (cell && !cell.classList.contains("start") && !cell.classList.contains("goal")){
      cell.classList.add("path");
    }
  });
  info.textContent = `UCS found path (length ${path.length-1}) — press Next to move the drone along it.`;
  followingPath = true;
  pathIndex = 0;
  nextBtn.disabled = false;
}

computeBtn.addEventListener("click", async ()=>{
  // disable compute while loading
  computeBtn.disabled = true;
  nextBtn.disabled = true;
  info.textContent = "Computing UCS...";
  const res = await fetch("/run_ucs");
  const data = await res.json();
  steps = data.steps;
  path = data.path;
  stepIndex = 0;
  followingPath = false;
  pathIndex = 0;

  if (!steps || steps.length === 0){
    info.textContent = "No steps returned.";
    computeBtn.disabled = false;
    return;
  }

  // render first step (but do not auto-pop)
  renderStep(steps[0]);
  nextBtn.disabled = false;
  computeBtn.disabled = false;
});

nextBtn.addEventListener("click", ()=>{
  if (followingPath){
    // move along final path one cell at a time
    if (pathIndex >= path.length) {
      info.textContent = "Drone arrived.";
      nextBtn.disabled = true;
      return;
    }
    // mark current drone position
    clearVisuals();
    // color the path up to current index
    for (let i=0;i<=pathIndex;i++){
      const [r,c] = path[i];
      const cell = cellAt(r,c);
      if (cell && !cell.classList.contains("start") && !cell.classList.contains("goal")){
        cell.classList.add("path");
      }
    }
    info.textContent = `Drone moved to ${JSON.stringify(path[pathIndex])} (step ${pathIndex}/${path.length-1})`;
    pathIndex++;
    if (pathIndex > path.length-1){
      info.textContent = "Drone arrived at destination.";
      nextBtn.disabled = true;
    }
    return;
  }

  // stepping through UCS expansion steps
  if (stepIndex >= steps.length){
    // steps done; show final path and switch mode
    if (path && path.length > 0){
      renderFinalPath();
    } else {
      info.textContent = "UCS finished: no path found.";
      nextBtn.disabled = true;
    }
    return;
  }

  const step = steps[stepIndex];
  renderStep(step);
  stepIndex++;

  // if this step popped the goal, prepare final path mode
  if (JSON.stringify(step.current) === JSON.stringify([parseInt(step.current[0]), parseInt(step.current[1])]) ){
    // already handled; but check if goal
  }
  if (path && path.length > 0 && JSON.stringify(step.current) === JSON.stringify(path[path.length-1])){
    // goal popped in this step
    info.textContent = "Goal popped — UCS has found the optimal path. Click Next to follow the path.";
    // leave nextBtn enabled to let user click to follow path
  }
});

regenBtn.addEventListener("click", async ()=>{
  // hit server to regen grid and reload the page to see new layout
  await fetch("/regen");
  location.reload();
});

// initial info
info.textContent = "Click Compute Route to run UCS on this grid.";

from flask import Flask, render_template, jsonify
import random
import heapq

app = Flask(__name__)

ROWS, COLS = 5, 5
START = (0, 0)
GOAL = (4, 4)

# Global grid (generated once; can regenerate on server restart)
def generate_grid():
    grid = [[0 for _ in range(COLS)] for _ in range(ROWS)]
    total_obs = random.randint(7, 9)
    placed = 0
    while placed < total_obs:
        r = random.randint(0, ROWS - 1)
        c = random.randint(0, COLS - 1)
        if (r, c) not in [START, GOAL] and grid[r][c] == 0:
            grid[r][c] = 1  # obstacle / no-fly
            placed += 1
    # Ensure start and goal are free
    grid[START[0]][START[1]] = 0
    grid[GOAL[0]][GOAL[1]] = 0
    return grid

GRID = generate_grid()

def neighbors(pos):
    r, c = pos
    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
        nr, nc = r+dr, c+dc
        if 0 <= nr < ROWS and 0 <= nc < COLS:
            yield (nr, nc)

def ucs(grid, start, goal):
    """
    Uniform Cost Search.
    Returns:
      - path: list of nodes from start to goal (inclusive) as lists [r,c]; empty list if no path
      - steps: a list of step-dicts recording each popped node:
            { "current": [r,c],
              "cost": g,
              "frontier": [ { "pos": [r,c], "cost": g }, ... ],
              "explored": [ [r,c], ... ]
            }
    """
    frontier = []  # min-heap of (cost, node, path)
    heapq.heappush(frontier, (0, start, [start]))
    explored = set()
    steps = []

    while frontier:
        cost, node, path = heapq.heappop(frontier)
        if node in explored:
            continue

        # record the frontier snapshot and current popped node
        frontier_snapshot = [ {"pos": list(n), "cost": c} for (c, n, _) in frontier ]
        steps.append({
            "current": list(node),
            "cost": cost,
            "frontier": frontier_snapshot,
            "explored": [list(e) for e in explored]
        })

        if node == goal:
            return [list(p) for p in path], steps

        explored.add(node)

        for nbr in neighbors(node):
            if grid[nbr[0]][nbr[1]] == 1:
                continue  # obstacle
            if nbr in explored:
                continue
            new_cost = cost + 1  # uniform cost = 1 per move (can be extended)
            heapq.heappush(frontier, (new_cost, nbr, path + [nbr]))

    return [], steps

@app.route("/")
def index():
    # Render grid server-side (DOM will contain cells). We intentionally do not embed JS data here.
    return render_template("index.html", grid=GRID, rows=ROWS, cols=COLS, start=START, goal=GOAL)

@app.route("/run_ucs")
def run_ucs():
    # Run UCS on the current GRID, starting at START ending at GOAL
    path, steps = ucs(GRID, START, GOAL)
    return jsonify({"grid": GRID, "start": list(START), "goal": list(GOAL), "path": path, "steps": steps})

@app.route("/regen")
def regen():
    # regenerate a new grid (useful if you want a fresh maze)
    global GRID
    GRID = generate_grid()
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(debug=True)

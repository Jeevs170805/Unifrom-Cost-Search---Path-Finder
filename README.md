# Smart Drone Delivery in a City Grid

## Project Overview
This project simulates a smart drone delivery system in a city represented as a grid.  
The drone navigates from a warehouse (start) to a customer's house (goal) while avoiding no-fly zones (obstacles) and choosing the path that consumes the least battery.  

The system uses **Uniform Cost Search (UCS)** to find the optimal path in terms of battery consumption.  

---

## Real-World Relevance
With the rise of e-commerce, drones are increasingly used for fast, efficient delivery.  
This simulation helps understand:
- Path planning in urban environments.
- Avoiding restricted zones.
- Minimizing delivery cost (battery usage).

---

## Environment (PEAS)
| Component | Description |
|-----------|-------------|
| Performance measure | Delivery success, shortest path, minimum battery consumption |
| Environment | 5×5 city grid with obstacles representing no-fly zones |
| Actuators | Drone movements: Up, Down, Left, Right |
| Sensors | Drone position, obstacle detection, battery level |

---

## Problem Formulation
- **Initial state:** Drone at warehouse `(0,0)`  
- **Goal state:** Drone reaches customer `(4,4)`  
- **Goal test:** Drone position equals goal cell  
- **Actions:** Move Up, Down, Left, Right (within grid & avoiding obstacles)

---

## State Space Representation
- Grid is represented as a 5×5 matrix:

## Core Strategy – Uniform Cost Search
- Algorithm: UCS always expands the lowest-cost node from the frontier.
- Cost metric: Battery consumption (assume 1 unit per move).
- Implementation steps:
- Initialize the frontier with the start node and cost = 0.
While frontier is not empty:
Pop the node with the lowest cost.
If it’s the goal, return path and cost.
Expand all valid neighboring nodes and add to frontier with updated cost.
Avoid revisiting nodes to prevent loops.

## UI
<img width="1844" height="860" alt="image" src="https://github.com/user-attachments/assets/1bef2488-80a8-4384-afe9-464688f16ce4" />
<img width="1850" height="864" alt="image" src="https://github.com/user-attachments/assets/0fb4bffc-2806-4b3f-8b5f-29105bad9d15" />





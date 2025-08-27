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


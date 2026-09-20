# NodeMap

A high-performance, fully interactive spatial computing workspace built to map out complex logic, workflows, and structures. 

NodeMap is a visual node-based editor engineered for velocity and clarity. Whether you are building an investigative storyboard, planning out architectural microservices, or tracing complex data pipelines, NodeMap provides a boundless canvas to structure chaos.

## Core Features

- **Infinite Interactive Canvas:** Built on top of React Flow, the core editor supports fluid panning, zooming, and infinite workspace dimensions.
- **Dynamic Node Topologies:** Create custom node schemas and categories on the fly. Drop nodes onto the canvas and establish directional or non-directional edges to build out your relationship graph.
- **Algorithmic Pathfinding:** Features a built-in shortest-path graph search algorithm that traverses complex webs of nodes to instantly highlight the connection chain between any two distant entities.
- **Adaptive Layout Engine:** Engineered with Tailwind CSS v4, featuring a highly responsive, glassmorphic UI. On mobile devices, the workspace transforms, shifting complex HUDs into an ergonomic, thumb-friendly bottom sheet navigation architecture.
- **Real-Time Workspace Sync:** Integrated seamlessly with our custom RESTful NodeMap backend to securely persist complex JSON graph payloads.

## Tech Stack

The architecture is built on modern web primitives focusing on rendering performance and a robust data layer.

### Frontend
- **Framework:** React 19 + Vite for sub-millisecond HMR and highly optimized production builds.
- **Styling Engine:** Tailwind CSS v4 for utility-first styling with zero-runtime cost.
- **Canvas Rendering:** `@xyflow/react` powers the robust SVG-based graph rendering layer, handling complex drag-and-drop mathematics and coordinate systems out of the box.
- **State & Data:** Context API merged with custom React hooks (`useBoards`, `useNodes`) orchestrating state across the canvas, side-stepping bloated global state managers for native, lightweight performance.
- **Network Layer:** Axios handling complex asynchronous payloads to the NodeMap backend.

### Backend
- **Server:** Node.js with Express.js handling robust REST API routing and middleware.
- **Database:** MongoDB driven by Mongoose for flexible, schema-based NoSQL document structures perfectly suited for storing infinite graph nodes and edges.
- **Authentication:** JWT-based stateless authentication utilizing httpOnly secure cookies.

## Local Development

The repository is structured as a monorepo containing both the frontend and backend.

### 1. Backend Setup

```bash
cd backend
npm install
```

Ensure your local MongoDB instance is running, or provide a `MONGO_URI` in an `.env` file inside the backend directory. Then start the API:

```bash
npm start
```
The backend API runs by default on `http://localhost:3000`.

### 2. Frontend Setup

In a new terminal instance:

```bash
cd frontend
npm install
npm run dev
```

The application will start with full hot-module replacement on `http://localhost:5173`.

## Design Philosophy

The aesthetic approach behind NodeMap prioritizes a "dark-mode native" environment to reduce eye strain during extended mapping sessions. We rely heavily on subtle gradients, `backdrop-filter` glassmorphism, and high-contrast teal accents to guide the user's eye toward critical pathing actions and canvas interactions without overwhelming the visual hierarchy.

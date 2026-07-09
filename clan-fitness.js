const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to let Express read JSON data from incoming requests
app.use(express.json());

// ==========================================
// MOCK DATABASE (Simulating PostgreSQL Tables)
// ==========================================
let users = [
  { id: 1, name: "Alex Rodriguez", email: "alex@fit.com", teamId: 10 },
  { id: 2, name: "Sam Taylor", email: "sam@fit.com", teamId: 10 }
];

let teams = [
  { id: 10, teamName: "Visalia Iron Crew" }
];

let workouts = [
  { id: 1, userId: 1, title: "Heavy Squat Day", durationMinutes: 45, date: "2026-07-01" },
  { id: 2, userId: 1, title: "5k Morning Run", durationMinutes: 25, date: "2026-07-02" },
  { id: 3, userId: 2, title: "Upper Body Push", durationMinutes: 60, date: "2026-07-02" }
];

// ==========================================
// EXPRESS ENDPOINTS (API Routes)
// ==========================================

// 1. GET: Fetch a single user profile
app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// 2. GET: Fetch all workouts for a specific user (Simulating a Relation)
app.get('/api/users/:id/workouts', (req, res) => {
  const userId = parseInt(req.params.id);
  const userWorkouts = workouts.filter(w => w.userId === userId);
  
  res.json(userWorkouts);
});

// 3. POST: Log a new workout (Simulating database insertion)
app.post('/api/workouts', (req, res) => {
  const { userId, title, durationMinutes } = req.body;

  if (!userId || !title || !durationMinutes) {
    return res.status(400).json({ error: "Missing required workout fields" });
  }

  const newWorkout = {
    id: workouts.length + 1, // Simple auto-increment simulation
    userId: parseInt(userId),
    title,
    durationMinutes: parseInt(durationMinutes),
    date: new Date().toISOString().split('T')[0] // Sets today's date YYYY-MM-DD
  };

  workouts.push(newWorkout);
  res.status(201).json({ message: "Workout tracked successfully!", workout: newWorkout });
});

// 4. GET: Fetch a team and all its members (Simulating a Join)
app.get('/api/teams/:id', (req, res) => {
  const teamId = parseInt(req.params.id);
  const team = teams.find(t => t.id === teamId);

  if (!team) {
    return res.status(404).json({ error: "Team not found" });
  }

  // Find all users belonging to this team
  const teamMembers = users.filter(u => u.teamId === teamId);

  res.json({
    ...team,
    members: teamMembers
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Fitness backend running at http://localhost:${PORT}`);
});

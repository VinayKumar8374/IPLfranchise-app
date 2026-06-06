const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for static assets
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to get all teams summary
app.get('/api/teams', (req, res) => {
    fs.readFile(path.join(__dirname, 'data', 'teams.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        const teams = JSON.parse(data);
        // Map light details for sidebar/list view
        const summary = teams.map(({ id, name, shortName, logo, primaryColor }) => ({
            id, name, shortName, logo, primaryColor
        }));
        res.json(summary);
    });
});

// API Endpoint to get full details of a specific team
app.get('/api/teams/:id', (req, res) => {
    const teamId = req.params.id;
    fs.readFile(path.join(__dirname, 'data', 'teams.json'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        const teams = JSON.parse(data);
        const team = teams.find(t => t.id === teamId);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(team);
    });
});

// Fallback to route to main index html page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

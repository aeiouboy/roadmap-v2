import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'roadmap-data.json');

app.use(cors());
app.use(express.json());

// Serve static files from dist folder in production
app.use(express.static(path.join(__dirname, 'dist')));

// Get roadmap data
app.get('/api/roadmap', async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty data
      res.json({
        categories: [],
        sprints: [],
        features: [],
        checkpoints: [],
        milestones: []
      });
    } else {
      res.status(500).json({ error: 'Failed to read data' });
    }
  }
});

// Save roadmap data
app.post('/api/roadmap', async (req, res) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2));
    res.json({ success: true, message: 'Data saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Handle SPA routing - serve index.html for all other routes
app.use((req, res, next) => {
  // Only serve index.html for non-API routes that don't match static files
  if (!req.path.startsWith('/api') && !req.path.includes('.')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    next();
  }
});

app.listen(PORT, () => {
  console.log(`Roadmap server running on port ${PORT}`);
});

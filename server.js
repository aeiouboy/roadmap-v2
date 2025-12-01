import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'roadmap-data.json');

app.use(cors());
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Roadmap API server running on http://localhost:${PORT}`);
});

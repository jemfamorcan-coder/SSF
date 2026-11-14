const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');

// Serve static assets from dist
app.use(express.static(DIST_DIR, {
  index: false
}));

// API proxy for Google Sheets if requested
app.get('/api/sync-sheet', async (req, res) => {
  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send(`Failed to fetch from sheet: ${response.statusText}`);
    }
    const text = await response.text();
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(text);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Fetch failed' });
  }
});

// Provide live report data endpoint
app.get('/api/live-data', (req, res) => {
  const fileCandidates = [
    path.join(__dirname, 'public/assets/aistudio/Stockpile_and_Standby_Funds__SSF__Monitoring_Report_56c2f776'),
    path.join(__dirname, 'public/assets/aistudio/Stockpile_and_Standby_Funds__SSF__Monitoring_Report_cf059da9'),
    path.join(__dirname, 'public/assets/aistudio/Stockpile_and_Standby_Funds__SSF__Monitoring_Report_68657a5f'),
    path.join(__dirname, 'public/assets/aistudio/Stockpile_and_Standby_Funds__SSF__Monitoring_Report_05f82081')
  ];
  const filePath = fileCandidates.find(f => fs.existsSync(f));
  
  if (filePath && fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(content);
  } else {
    res.status(404).json({ error: 'Report file not found' });
  }
});

// SPA fallback: serve index.html for all other routes
app.get('*', (req, res) => {
  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Build files not found. Please run npm run build.');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SSF Analytics server running on port ${PORT}`);
});

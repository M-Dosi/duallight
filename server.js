const express = require('express');
const path = require('path');
const unlighthouse = require('./unlighthouse.js');
const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

app.post('/api/audit', async (req, res) => {
   const config = unlighthouse.createConfigFile(req.body);
   const unlighthouseInstance = await unlighthouse.createUnlighthouse(config, {});

   async function runAudit() {
    try {
      const results = await unlighthouseInstance.start();
      console.log('Audit Results:', results);
      res.json(results);
    } catch (error) {
      console.error('Audit failed:', error);
    }
  }
  runAudit();
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});


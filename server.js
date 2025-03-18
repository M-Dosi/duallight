const express = require('express');
const path = require('path');
const unlighthouse = require('./unlighthouse.js');
const app = express();
const fs = require('fs');
const _ = require('lodash');

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
      // console.log('Audit Results:', results);
      const filePath = path.join(__dirname, 'map.json');

      let jsonData;
      try {
        const data = fs.readFileSync(filePath, 'utf8');
        jsonData = JSON.parse(data); 
      }
      catch (err) {
        jsonData = undefined;
      }

      const auditItem = generateAuditItem(results);

      if (jsonData){
        jsonData.map.push(auditItem)
      }
      else {
        jsonData = {
          map: [auditItem]
        }
      }

      fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (err) => {
        if (err) {
          res.status(500).send('Error generating JSON file');
          return;
        }
        res.send('JSON file has been generated successfully');
      });

      // const sanitizedResults = _.pick(results, ['audit', 'score', 'report']);
      // res.json(sanitizedResults);
    } catch (error) {
      console.error('Audit failed:', error);
    }
  }
  runAudit();
});

app.get('/report', (req, res) =>{
  const {domaine, id, routeIndex} =  req.query;
  
    const filePath = path.join(__dirname, 'map.json');
    let jsonData;
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      jsonData = JSON.parse(data); 
    }
    catch (err) {
      jsonData = undefined;
    }
  
    const pathURL = jsonData.map.find(item => {
      return  item.id === id
    }).urls[routeIndex];
  
    const route = ['public', 'reports', domaine,  id, 'reports', ...pathURL.path ]
  
    // console.log(filePath);
  
    // console.log(pathURL);
  
    const htmlPath = path.join(__dirname, ...route ,'lighthouse.html');
  
    // console.log(htmlPath);
  
    res.sendFile(htmlPath);
})

app.get('/api/map', (req, res) =>{
  const filePath = path.join(__dirname, 'map.json');

  let jsonData = {};
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    jsonData = JSON.parse(data); 
  }
  catch (err) {
    res.status(404).send({
      message: 'Error'
    });
  }

  res.send(jsonData);
})


const open = require('open');

app.listen(3000, () => {
  console.log('Server started on port 3000');
  open('http://localhost:3000');
});


function generateAuditItem(results){
  const {runtimeSettings, routes} = results;
  const auditItem = {
        id: runtimeSettings.configCacheKey,
        domaine: runtimeSettings.siteUrl.host,
        created_at: new Date().getTime(),
        urls: routes.map(item => {
          return {
            url: item.url,
            path: item.path.split('/').slice(1)
          }
         })
  };

  return auditItem;
}



// x close momenat nije najbolje array i objekat konflikt

app.post('/update-map', (req, res) => {
  const mapId = req.body.mapId;

  const filePath = path.join(__dirname, 'map.json');
  const data = fs.readFileSync(filePath, 'utf8');
  let maps = JSON.parse(data);

  const mapArray = maps.map; // access the map property
  const mapIndex = mapArray.findIndex((map) => map.id === mapId);

  if (mapIndex !== -1) {
    mapArray.splice(mapIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(maps, null, 2));
    res.send('Map deleted successfully!');
  } else {
    console.log('Map not found!');
    res.status(404).send('Map not found!');
  }
});
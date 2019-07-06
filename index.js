const express = require('express');
const app = express();
const tj = require("@tmcw/togeojson");
const fs = require("fs");
const DOMParser = require("xmldom").DOMParser;
const geolib = require('geolib');
const kml = new DOMParser().parseFromString(fs.readFileSync("FullStackTest_DeliveryAreas.kml", "utf8"));

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

app.get('/api/outlet/:latitude/:longitude', (req, res)=>{
    let latitude = req.params.latitude;
    let longitude = req.params.longitude;
    let resturant = 'not found';

    console.log('got hit with latitude:'+latitude+' longitude:'+longitude);

    if(latitude && longitude){
    const converted = tj.kml(kml);
    converted.features.forEach(feature=>{
        let polygons = feature.geometry.coordinates[0];
        if(polygons instanceof Array){
            if(geolib.isPointInPolygon({latitude: latitude, longitude: longitude}, polygons)){
                resturant= feature.properties.name;
            }
        }
    });
    res.send(resturant);
}
});

const port = process.env.PORT || 3000;
app.listen(port, ()=>console.log(`Listening on port ${port}...`))
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

/**
 * 
 * Reads raw crime data from a csv file 
 * and returns a heat map with weighted values.
 * @author Will Zhao
 * @param {*} relPath 
 */
function parse(relPath) {
    const absolute = path.resolve(relPath);

    //read input csv file
    let text = fs.readFileSync(absolute, "utf8");

    let data = text.split("\n").map(row => {
        let crimeData = row.split(",");
        
        return {
            latitude: crimeData[0],
            longitude: crimeData[1],
            weight: [crimeData[2], crimeData[3]]
        };
    });

    let maxWeight = 1;
    let minWeight = 1;

    //find the max and minimum absolute weights
    data.forEach(function(data) {
       let injured = data.weight[0];
       let killed = data.weight[1];

       //each gun violence incident has a default weight of 1
       let weight = 1 + (injured) + (2 * killed);

       if (weight > maxWeight) {
           maxWeight = weight;
       }
       else if (weight < minWeight) {
           minWeight = weight;
       }
    });

    //must convert weights with respect to percentage
    return data.map(dataPoint => {
        let injured = dataPoint.weight[0];
        let killed = dataPoint.weight[1];

        let weight = 1 + (injured) + (2 * killed);
        
        //subtract 20 to reduce point intensity/opacity
        let scaledWeight = (weight / maxWeight) * 100 - 20;

        return {
            latitude: dataPoint.latitude,
            longitude: dataPoint.longitude,
            weight: scaledWeight
        };
    });
}

app.get("/data-mock", (req, res) => {
    res.json(parse("./data/random_lat_lon.csv").sort((a, b) => a.weight - b.weight));
});

app.get("/data", (req, res) => {
    res.json(parse("./data/texas.csv").sort((a, b) => a.weight - b.weight));
});

app.listen(8080);
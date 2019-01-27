const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

function parse(relPath) {
    const absolute = path.resolve(relPath);

    const text = fs.readFileSync(absolute, "utf8");

    return text.split("\n").map(row => {
        let data = row.split(",");
        return {
            latitude: data[0],
            longitude: data[1],
            weight: 0
        };
    });
}

app.get("/data-mock", (req, res) => {

});
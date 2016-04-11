// This is a script to execute with node.js in order to have the amount of bank per States

const Banklist = require("./resources/banklistVer2.json")
var StatesCode = require("./resources/statesCode.json")

var newTab = [];

for (var i = 0; i < StatesCode.length; i++) {
    newTab[StatesCode[i].abbreviation] = {};
    newTab[StatesCode[i].abbreviation].code = StatesCode[i].name;
    newTab[StatesCode[i].abbreviation].value = 0;
}

for (var i = 0; i < Banklist.length; i++) {
    newTab[Banklist[i].ST].value += 1;
}


for (i in newTab) {
    console.log(newTab[i].code + " : " + newTab[i].value);
}

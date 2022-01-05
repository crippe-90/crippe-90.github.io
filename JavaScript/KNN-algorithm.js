
const input = document.getElementById('File');
const k = 7;
let data = {};
let dataColors = [];
let titles = [];
let canvases = [];
let summarizedData = [];

input.addEventListener('change', (event) => {
    let file = event.target.files;
    if(file.length===1){
      readSingleFile(file);
    }
    else{
      alert("Only single file supported");
      }
});

function showOptions(){
  for(let i = 0; i < titles.length -1; i++){
    let radiobox = document.createElement('input');
    radiobox.type = 'radio';
    radiobox.id = 'datapoint1';
    radiobox.value = titles[i];

    var label = document.createElement('label')
    label.htmlFor = 'choice 1';

    var description = document.createTextNode(titles[i]);
    label.appendChild(description);

    var newline = document.createElement('br');

    var container = document.getElementById('show-options');
    container.appendChild(radiobox);
    container.appendChild(label);
    container.appendChild(newline);
  }
  for(let i = 0; i < titles.length -1; i++){
    var radiobox = document.createElement('input');
    radiobox.type = 'radio';
    radiobox.id = 'datapoint2';
    radiobox.value = titles[i];

    var label = document.createElement('label')
    label.htmlFor = 'choice 2';

    var description = document.createTextNode(titles[i]);
    label.appendChild(description);

    var newline = document.createElement('br');

    var container = document.getElementById('show-options');
    container.appendChild(radiobox);
    container.appendChild(label);
    container.appendChild(newline);
  }
}
//Plots all data
function plotAllDataInTable(){
  const body = document.body,
        table = document.createElement('table');
        table.className = "data-table";
  const tableRow = table.insertRow();
  for(let i = 0; i < titles.length; i++){
    const tableData = tableRow.insertCell();
    tableData.appendChild(document.createTextNode(titles[i]));
    tableData.style.border = '1px solid orange';
  }

  for (let i = 0; i < data.length; i++) {
    const tableRow = table.insertRow();
    for(let j = 0; j < titles.length; j++){
      let td = tableRow.insertCell();
      td.style.border = '1px solid orange';
          td.appendChild(document.createTextNode(data[i][titles[j]]));
    }
  }
  body.appendChild(table);

}

//Get the largest distance in an array.
function largestNumberInArr(arr){
  arr.sort((a, b) => {return a.distance - b.distance;});
  return arr[arr.length-1].distance;
}

//Find the k nearest neigbour for each datapoint
function getKNearestNeighbours(d,k){
  let k_nn = [];
  for(let x = 0; x < k; x++){
    let currentDistance = Number.MAX_VALUE;
    let currentClass = "";
    k_nn.push({distance: currentDistance, class: currentClass});
  }
  for(let i = 0; i < data.length; i++){
    let distance = calculateDistance(data[i], d);
    if(distance!==0){
      currentDistance = largestNumberInArr(k_nn);
      if(distance < currentDistance){
        currentDistance = distance;
        currentClass = data[i]["\"class\""];
        k_nn.unshift({distance: currentDistance, class: currentClass});
        k_nn.splice(k);
      }
    }
    }
    return k_nn;
}

//Euclidean distance in 2d
function calculateDistance(nn,d){
  let nn_x_pos = nn["\"petalwidth\""];
  let d_x_pos = d["\"petalwidth\""];
  let nn_y_pos = nn["\"petallength\""];
  let d_y_pos = d["\"petallength\""];
  return Math.sqrt(((nn_x_pos - d_x_pos)*(nn_x_pos - d_x_pos)) + ((nn_y_pos - d_y_pos)*(nn_y_pos - d_y_pos)));
}

//Gets the most frequent occuring class name from the k nearest neigbour.
function getMostFrequent(nn) {
  let classNames = [];
  for(let i = 0; i < nn.length; i++){
    classNames.push(nn[i].class);
  }

  const hashmap = classNames.reduce( (acc, val) => {
    acc[val] = (acc[val] || 0 ) + 1
    return acc
 },{})
return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b)
}

//For each datapoints, get k nearest neigbour and the most occuring class from those neigbours.
function classifyData(){
  for(let i = 0; i < data.length; i++){
    let nn = getKNearestNeighbours(data[i], k);
    let predictedClassName = getMostFrequent(nn);
    data[i]["Predicted class"] = predictedClassName;
  }

  plotAllDataInTable();
}

//Reads a single file .csv file, converts it to an object.
function readSingleFile(e) {
    let file = e[0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.onload = function(e) {
      var fileContent = e.target.result;
      data = parseFileToJson(fileContent);
      titles = Object.keys(data[0]);
      titles.push("Predicted class");
      showOptions();
      //classifyData();
      /*
      setDataClassColors();
      createCanvas("Sepal length and width.");
      createCanvas("Petal length and width.");
      plotData(0);
      plotData(1);
      */
    };
    reader.readAsText(file);
  }

//Parses file to JSON.
function parseFileToJson(fileString){
    let arr = fileString.split('\n');
    let jsonObj = [];
    let headers = arr[0].split(',');
    for(let i = 1; i < arr.length-1; i++) {
      let data = arr[i].split(',');
      let obj = {};
      for(let j = 0; j < data.length; j++) {
        obj[headers[j].trim()] = data[j].trim();
        }
      jsonObj.push(obj);
    }
    return jsonObj;
}

//Randomly assigns color to the different classes(currently not in use)
function getColor(c){
  for(let i = 0; i < dataColors.length; i++){
    if(c===dataColors[i].dataClass){
      return dataColors[i].color
    }
  }
}

//Plots the data on canvas(currently not in use)
function plotData(index){
  if(index===0){
    for(let i = 0; i<data.length; i++){
      let actualClass = data[i]["\"class\""];
      let y = data[i]["\"petallength\""]*30;
      let x = data[i]["\"petalwidth\""]*60;
      let color = getColor(actualClass);
      color = "#" + color.toString().toUpperCase();
      drawCircle(canvases[index], x, y, color)
    }
  }
else{
    for(let i = 0; i<data.length; i++){
      let actualClass = data[i]["\"class\""];
      let y = data[i]["\"sepallength\""]*30;
      let x = data[i]["\"sepalwidth\""]*60;
      let color = getColor(actualClass);
      color = "#" + color.toString().toUpperCase();
      drawCircle(canvases[index], x, y, color)
      }
      clasifyData();
  }
}

//Sets color for the different data-classes on the canvas(currently not in use)
function setDataClassColors(){
  for(let i = 0; i<data.length; i++){
    let dClass = data[i]["\"class\""]
    if (!(dataColors.some(e => e.dataClass === dClass))) {
      let color = parseInt((Math.random()*0xfff000)).toString(16);
      dataColors.push({dataClass: dClass, color: color});
    }
  }
}

//Draws circles on the canvas(currently not in use)
function drawCircle(canvas,x=0,y=0, color){
  var context = canvas.getContext("2d");
  var posx = x;
  var posy = y;
  context.fillStyle = color;
  context.beginPath();
  context.arc(posx, posy, 3, 0, 2 * Math.PI);
  context.fill();
}

//Draws a grid on canvas(currently not in use)
function drawGrid(canvas){
  const ctx = canvas.getContext("2d");
  grid_size = 25;
  var num_lines_x = Math.floor(canvas.height/grid_size);
  var num_lines_y = Math.floor(canvas.width/grid_size);
  for(let i=0; i<=num_lines_x; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    if(i == num_lines_x) {
        ctx.moveTo(0, grid_size*i);
        ctx.lineTo(canvas.width, grid_size*i);
    }
    else {
        ctx.moveTo(0, grid_size*i+0.5);
        ctx.lineTo(canvas.width, grid_size*i+0.5);
    }
    ctx.stroke();

}
for(i=0; i<=num_lines_y; i++) {
ctx.beginPath();
if(i == num_lines_y) {
    ctx.moveTo(grid_size*i, 0);
    ctx.lineTo(grid_size*i, canvas.height);
}
else {
    ctx.moveTo(grid_size*i+0.5, 0);
    ctx.lineTo(grid_size*i+0.5, canvas.height);
}
ctx.stroke();
}

for(i=0; i<=40; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    ctx.moveTo(grid_size*i+0.5, -3);
    ctx.lineTo(grid_size*i+0.5, 3);
    ctx.stroke();

    // Text value at that point
    ctx.font = '9px Arial';
    ctx.textAlign = 'end';
    ctx.fillText((i*25/60).toFixed(2), grid_size*i-2, 15);
}
// Ticks marks along the negative Y-axis
// Negative Y-axis of graph is positive Y-axis of the canvas
for(i=0; i<=20; i++) {
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";
    ctx.moveTo(-3, -grid_size*i+0.5);
    ctx.lineTo(3, -grid_size*i+0.5);
    ctx.stroke();
    ctx.font = '9px Arial';
    ctx.textAlign = 'start';
    ctx.fillText((i*25/30).toFixed(2), 8, grid_size*i-2, 15);
}
}

//Creates canvases (currently not in use)
function createCanvas(textString){
  var canvas = document.createElement('canvas');
  canvas.className = "graphics";
  canvas.width = 500;
  canvas.height = 250;
  drawGrid(canvas);
  let body = document.getElementsByTagName("body")[0];
  body.appendChild(canvas);
  canvases.push(canvas);
  let tag = document.createElement("p");
  let text = document.createTextNode(textString);
  tag.appendChild(text);
  body.appendChild(tag);
}

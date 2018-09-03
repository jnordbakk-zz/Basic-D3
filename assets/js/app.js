// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var  chartWidth  = svgWidth - margin.left - margin.right;
var chartHeight  = svgHeight - margin.top - margin.bottom;



// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// // Import Data
d3.csv("data.csv", function(err, healthdata) {
  console.log("err: ", err);
  console.log("healthdata: ", healthdata);
  if (err) throw err;


  // Step 1: Parse Data/Cast as numbers
  // ==============================

  healthdata.forEach(function(data) {
    data.income = +data.income;
    data.obesity= +data.obesity;
    data.age= +data.age;
    // console.log("obesity:",data.obesity);
    // console.log("income:", data.income);
  });

  var income = healthdata.map(data => data.income);
  var obesity= healthdata.map(data => data.obesity);
  var age= healthdata.map(data => data.age);
  var state= healthdata.map(data => data.abbr);



// Step 2: Create scale functions
  // ==============================

  // console.log(dataArray2)

  // scale y to chart height
var yScale = d3.scaleLinear()
.domain([0, d3.max(income)])
.range([chartHeight, 0]);
 console.log(d3.max(income))

// scale x to chart width
var xScale = d3.scaleLinear()
.domain([0, d3.max(obesity)])
.range([0, chartWidth]);
// .padding(0.05);
console.log(d3.max(obesity))


  // Step 3: Create axis functions
  // ==============================

  var yAxis = d3.axisLeft(yScale);
  var xAxis = d3.axisBottom(xScale);

  // Step 4: Append Axes to the chart
  // ==============================

  // set x to the bottom of the chart
chartGroup.append("g")
.attr("transform", `translate(0, ${chartHeight})`)
.call(xAxis);

chartGroup.append("g")
.call(yAxis);

  // Step 5: Create Circles
  // ==============================

    // Append Data to chartGroup
var circlesGroup = chartGroup.selectAll(".scatter")
.data(healthdata)
.enter()
.append("circle")
.classed("trendcircle", true)
.attr("cx", d => xScale(d.obesity))
.attr("cy", d => yScale(d.income))
.attr("r", 15.5)
.attr("opacity","0.8")
.attr("fill", "steelblue")
;

chartGroup.selectAll("text")
.data(healthdata)
.enter()
.append("text")
.attr("x", d => xScale(d.obesity)-10)
.attr("y", d => yScale(d.income)+5)
.text((data => data.abbr))
.attr("fill", "white")
;


  //  Append a div to the body to create tooltips, assign it a class
  //= ======================================================
  var toolTip = d3.select("body").append("div")
    .attr("class", "tooltip");

  // Add an onmouseover event to display a tooltip
  //= =======================================================
  circlesGroup.on("mouseover", function(d, i) {
    toolTip.style("display", "block");
    toolTip.html(`State: <strong>${state[i]}</strong>`)
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY + "px");
  })
    // Add an onmouseout event to make the tooltip invisible
    .on("mouseout", function() {
      toolTip.style("display", "none");
    });


  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (chartHeight / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Income");

  chartGroup.append("text")
    .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + margin.top + 30})`)
    .attr("class", "axisText")
    .text("Obesity %");
});









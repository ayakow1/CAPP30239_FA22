/* Bar chart for COVID country cases*/

d3.csv("library_visits_jan22.csv").then((data) => {
  for (let d of data) {
    d.num = +d.num; //force a number
  }

  const height = 400, //pixel
    width = 800,
    margin = { top: 25, right: 30, bottom: 35, left: 50 }; //think like a clock

  let svg = d3
    .select("#chart") //select from id
    .append("svg") //add svg element
    .attr("viewBox", [0, 0, width, height]); //dynamic grow and shrink, start at 0,0 and grow proportionate to width and height

  let x = d3
    .scaleBand() //1st: domain (data), 2nd range (pixel space to take up)
    .domain(data.map((d) => d.branch)) //iterate over row and put into domain
    .range([margin.left, width - margin.right]) //pixels on page
    .padding(0.1);

  let y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.num)]) //d3.max returns the highest value
    .nice() // nice rounds the top num
    .range([height - margin.bottom, margin.top]); //svg are built from top down

  svg
    .append("g") //"g" element is a container element for grouping together
    .attr("transform", `translate(0, ${height - margin.bottom + 5})`) //push the axis to bottom
    .call(d3.axisBottom(x)); //hands the previous chain off to next function

  svg
    .append("g")
    .attr("transform", `translate(${margin.left - 5}, 0)`) //push the axis to left
    .call(d3.axisLeft(y));

  let bar = svg
    .selectAll(".bar")
    .append("g") //add new group element
    .data(data)
    .join("g") //put data into group
    .attr("class", "bar"); //add attribute to html

  bar
    .append("rect") // add rect to bar group
    .attr("fill", "steelblue") // bar color
    .attr("x", (d) => x(d.branch)) // x position attribute
    .attr("width", x.bandwidth()) // this width is the width attr on the element
    .attr("y", (d) => y(d.num)) // y position attribute
    .attr("height", (d) => y(0) - y(d.num)); // this height is the height attr on element

  bar
    .append("text") // add labels on each bar
    .text((d) => d.num)
    .attr("x", (d) => x(d.branch) + x.bandwidth() / 2) //text position
    .attr("y", (d) => y(d.num) + 15) //15 below
    .attr("text-anchor", "middle") // center text
    .style("fill", "white") // font color
    .style("font-size", "11px"); // font size
});

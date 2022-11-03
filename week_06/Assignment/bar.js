/* Stacked Bar chart for police shooting 
    Reference: https://d3-graph-gallery.com/graph/barplot_stacked_basicWide.html */

d3.csv("police_age_gender.csv").then((data) => {
  for (let d of data) {
    d.Male = +d.Male; //force a number
    d.Female = +d.Female;
  }

  const height = 400,
    width = 800,
    margin = { top: 25, right: 30, bottom: 35, left: 50 }; //think like a clock

  const male_color = "#74a9cf",
    female_color = "#f1eef6";

  var stack = d3.stack().keys(["Male", "Female"]);

  var stackedSeries = stack(data);

  var color = d3
    .scaleOrdinal()
    .domain(stackedSeries)
    .range([male_color, female_color]);

  let svg = d3
    .select("#barchart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]); //dynamic grow and shrink, start at 0,0 and grow proportionate to width and height

  let x = d3
    .scaleBand() //1st: domain (data 0, 1000), 2nd range (pixel space to take up)
    .domain(data.map((d) => d.Age)) //get each row and put it into domain
    .range([margin.left, width - margin.right])
    .padding(0.1);

  let y = d3
    .scaleLinear()
    .domain([0, 500]) // function(d) {return d.cases}
    .range([height - margin.bottom, margin.top]); //svg are built from top down

  const xAxis = (g) =>
    g //make a group
      .attr("transform", `translate(0, ${height - margin.bottom + 5})`)
      .call(d3.axisBottom(x)); //run immediately

  const yAxis = (g) =>
    g //make a group
      .attr("transform", `translate(${margin.left - 5}, 0)`)
      .call(d3.axisLeft(y)); //run immediately

  svg.append("g").call(xAxis);

  svg.append("g").call(yAxis);

  svg
    .append("g")
    .selectAll("g") // appending a group
    .data(stackedSeries)
    .join("g")
    .attr("fill", (d) => color(d.key))
    .selectAll("rect")
    .data((d) => d)
    .join("rect")
    .attr("x", (d) => x(d.data.Age))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d[1]))
    .attr("height", (d) => y(d[0]) - y(d[1]));

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width - margin.right)
    .attr("y", height - margin.bottom / 2 + 5)
    .attr("dx", "0.5em")
    .attr("dy", "-0.5em")
    .text("Ages")
    .attr("fill", "white");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top / 2)
    .attr("dx", "-0.5em")
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("Number")
    .attr("fill", "white");

  /* Create Legend
        Reference: https://d3-graph-gallery.com/graph/custom_legend.html#cat1 */
  svg
    .append("circle")
    .attr("cx", width - 3 * margin.right)
    .attr("cy", -margin.top + 100)
    .attr("r", 6)
    .style("fill", female_color);

  svg
    .append("circle")
    .attr("cx", width - 3 * margin.right)
    .attr("cy", -margin.top + 130)
    .attr("r", 6)
    .style("fill", male_color);

  svg
    .append("text")
    .attr("x", width - 3 * margin.right + 20)
    .attr("y", -margin.top + 100)
    .text("Female")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white");
  svg
    .append("text")
    .attr("x", width - 3 * margin.right + 20)
    .attr("y", -margin.top + 130)
    .text("Male")
    .attr("alignment-baseline", "middle")
    .attr("fill", "white");
});

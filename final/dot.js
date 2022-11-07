/* Cleveland dot plot for predictions by age 
    Reference: https://d3-graph-gallery.com/graph/lollipop_cleveland.html*/

d3.csv("../data/prediction_dot.csv").then((data) => {
  for (let d of data) {
    d.y_2025 = +d.y_2025;
    d.y_2035 = +d.y_2035;
    d.y_2045 = +d.y_2045;
  }

  let height = 300,
    width = 450,
    margin = { top: 25, right: 55, bottom: 55, left: 120 };

  const svg = d3
    .select("#dotchart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  // Add X axis
  const x = d3
    .scaleLinear()
    .domain([10000.0, 35000.0])
    .range([margin.right, width - margin.left]);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(
      d3
        .axisBottom(x)
        .tickSizeOuter(5)
        .tickValues([10000, 15000, 20000, 25000, 30000, 35000])
    );

  // Y axis
  const y = d3
    .scaleBand()
    .range([0, height - margin.bottom])
    .domain(data.map((d) => d.ages))
    .padding(1);

  svg
    .append("g")
    .attr("transform", `translate(${margin.right},0)`)
    .call(d3.axisLeft(y).tickSize(0));

  // Lines
  svg
    .selectAll("myline")
    .data(data)
    .join("line")
    .attr("x1", function (d) {
      return x(d.y_2025);
    })
    .attr("x2", function (d) {
      return x(d.y_2045);
    })
    .attr("y1", function (d) {
      return y(d.ages);
    })
    .attr("y2", function (d) {
      return y(d.ages);
    })
    .attr("stroke", "grey")
    .attr("stroke-width", "1px")
    .attr("marker-end", (d) => `url(${new URL(`#arrow-${d.ages}`, location)})`);

  // Circles of variable 1
  svg
    .selectAll(".circle1")
    .data(data)
    .join("circle")
    .attr("class", "circle1")
    .attr("cx", function (d) {
      return x(d.y_2025);
    })
    .attr("cy", function (d) {
      return y(d.ages);
    })
    .attr("r", "6")
    .style("fill", "#feb24c");

  //   // Circles of variable 2
  //   svg
  //     .selectAll("mycircle")
  //     .data(data)
  //     .join("circle")
  //     .attr("cx", function (d) {
  //       return x(d.y_2035);
  //     })
  //     .attr("cy", function (d) {
  //       return y(d.ages);
  //     })
  //     .attr("r", "6")
  //     .style("fill", "#fd8d3c")
  //     .style("opacity", 0.5);

  // Circles of variable 2
  svg
    .selectAll(".circle2")
    .data(data)
    .join("circle")
    .attr("class", "circle2")
    .attr("cx", function (d) {
      return x(d.y_2045);
    })
    .attr("cy", function (d) {
      return y(d.ages);
    })
    .attr("r", "6")
    .style("fill", "#bd0026");

  svg
    .append("defs")
    .selectAll("marker")
    .data(data)
    .join("marker")
    .attr("id", (d) => `arrow-${d.ages}`)
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 15)
    .attr("refY", 0)
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .attr("orient", "auto")
    .attr("orient", "auto")
    .append("path")
    .attr("fill", "black")
    .attr("d", "M0,-5L10,0L0,5");

  const tooltip = d3
    .select("#dotchart")
    .append("div")
    .attr("class", "svg-tooltip2")
    .style("position", "absolute")
    .style("visibility", "hidden");

  d3.selectAll(".circle1")
    .on("mouseover", function (event, d) {
      tooltip
        .style("visibility", "visible")
        .html(
          `Year: 2025<br />Age: ${d.ages}<br />Population: ${d.y_2025.toFixed(
            0
          )}`
        );
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });

  d3.selectAll(".circle2")
    .on("mouseover", function (event, d) {
      tooltip
        .style("visibility", "visible")
        .html(
          `Year: 2045<br />Age: ${d.ages}<br />Population: ${d.y_2045.toFixed(
            0
          )} (thousand people)`
        );
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });

  // Manual legend
  svg
    .append("circle")
    .attr("cx", width - 110)
    .attr("cy", 30)
    .attr("r", 3)
    .style("fill", "#feb24c");
  svg
    .append("circle")
    .attr("cx", width - 75)
    .attr("cy", 30)
    .attr("r", 3)
    .style("fill", "#bd0026");

  svg
    .append("text")
    .attr("x", width - 105)
    .attr("y", 30)
    .text("2025")
    .style("font-size", "8px")
    .attr("alignment-baseline", "middle");
  svg
    .append("text")
    .attr("x", width - 70)
    .attr("y", 30)
    .text("2045")
    .style("font-size", "8px")
    .attr("alignment-baseline", "middle");

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width - margin.right + 15)
    .attr("y", height - margin.bottom + 36)
    .attr("dx", "0.5em")
    .attr("dy", "-0.5em")
    .text("Number of People (thousand)");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top / 2 - 10)
    .attr("dx", "-1em")
    .attr("y", 25)
    .attr("transform", "rotate(-90)")
    .text("Ages");

  svg
    .append("rect")
    .attr("width", width - margin.left - margin.right - 20)
    .attr("height", height / 5 + 10)
    .attr("x", margin.right + 7)
    .attr("y", height / 2)
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-dasharray", "2,2")
    .attr("stroke-width", "0.5")
    .style("opacity", 0.5);

  let str = `Percentage of people<br /> above 60: <br />
             36.3% (2025)<br />
             &#8595<br /> 
             43.4% (2045)`;

  svg
    .append("foreignObject") //put html annotation (more flexible than text)
    .attr("class", "annotation")
    .attr("x", width - 110)
    .attr("y", height / 2 - 5)
    .attr("width", 90)
    .attr("height", 100)
    .append("xhtml:div") //sth needed for browser
    .append("p")
    .html(str);

  svg
    .append("line")
    .attr("x1", width - 110)
    .attr("y1", height / 2 + 12)
    .attr("x2", width - 134)
    .attr("y2", height / 2 + 35)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "2,2")
    .attr("stroke-width", "0.5")
    .style("opacity", 0.5);
});

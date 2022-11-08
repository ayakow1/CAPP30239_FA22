/* Scatter plot for fertility vs price*/

d3.csv("../data/scatter.csv").then((data) => {
  let height = 300,
    width = 450,
    margin = { top: 25, right: 80, bottom: 55, left: 40 };

  const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);
  for (let d of data) {
    d.price = +d.price;
    d.fertility = +d.fertility;
  }

  let x = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.price))
    .nice()
    .range([margin.left, width - margin.right]);

  let y = d3
    .scaleLinear()
    .domain(d3.extent(data, (d) => d.fertility))
    .nice()
    .range([height - margin.bottom, margin.top]);

  let keys = ["Tokyo", "Nagoya", "Osaka", "Regions"];

  let shape = d3
    .scaleOrdinal()
    .domain(keys)
    .range([
      d3.symbolCircle,
      d3.symbolTriangle,
      d3.symbolSquare,
      d3.symbolCircle,
    ]);

  let color = d3
    .scaleOrdinal()
    .domain(keys)
    .range(["#fb9a99", "#b2df8a", "#fdbf6f", "#a6cee3"]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis")
    .call(d3.axisBottom(x).tickSize(5));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).tickSize(-width + margin.left + margin.right));

  svg
    .append("g")
    .selectAll(".symbols")
    .data(data)
    .join("path")
    .attr(
      "d",
      d3
        .symbol()
        .size(45)
        .type(function (d) {
          return shape(d.Location);
        })
    )
    .attr("class", "symbols")
    .attr("opacity", 0.75)
    .attr("fill", (d) => color(d.Location))
    .attr("transform", (d) => `translate(${x(d.price)},${y(d.fertility)})`);

  const tooltip = d3
    .select("#scatter")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  var previous;
  d3.selectAll(".symbols")
    .on("mouseover", function (event, d) {
      previous = d3.select(this).style("fill");
      d3.select(this).attr("fill", "black");
      console.log(d);
      tooltip
        .style("visibility", "visible")
        .html(
          `Prefecture: ${d.Prefecture}<br />Fertility rate: ${d.fertility}<br />Relative Price Index: ${d.price}`
        );
    })
    .on("mousemove", function (event) {
      tooltip
        .style("top", event.pageY - 10 + "px")
        .style("left", event.pageX + 10 + "px");
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", previous);
      tooltip.style("visibility", "hidden");
    });

  // Add one dot in the legend for each name.
  let size = 45;
  svg
    .selectAll("mydots")
    .data(keys)
    .join("path")
    .attr(
      "d",
      d3
        .symbol()
        .size(size)
        .type(function (d) {
          return shape(d);
        })
    )
    .attr(
      "transform",
      (d, i) => `translate(${width - 67},${height / 5 + i * 20 + size / 2})`
    )
    .style("fill", function (d) {
      return color(d);
    });

  // Add one dot in the legend for each name.
  svg
    .selectAll("mylabels")
    .data(keys)
    .join("text")
    .attr("x", width - 60)
    .attr("y", function (d, i) {
      return height / 5 + i * 20 + size / 2;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .text(function (d) {
      return `${d} area`;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width - margin.right)
    .attr("y", height)
    .attr("dx", "0.5em")
    .attr("dy", "-1.5em")
    .text("Regional Difference Index of Consumer Prices (All items)");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top / 2)
    .attr("dx", "-0.5em")
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("Fertility Rate");

  svg
    .append("line")
    .attr("x1", x(100))
    .attr("y1", height - margin.bottom)
    .attr("x2", x(100))
    .attr("y2", margin.top)
    .style("stroke-width", 0.5)
    .style("stroke", "red")
    .style("fill", "none");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", x(100))
    .attr("dx", "0.5em")
    .attr("y", margin.top + 17)
    .style("text-anchor", "start")
    .text("National Average Price")
    .style("fill", "red");
});

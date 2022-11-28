/* Scatter plot for fertility vs price*/

function create_scatter() {
  d3.csv("../data/scatter.csv").then((data) => {
    let height = 350,
      width = 550,
      margin = { top: 50, right: 80, bottom: 55, left: 50 };

    d3.select("#chart-container")
      .append("div")
      .html(
        `<h3>RELATIONSHIP BETWEEN FERTILITY RATE AND PRICE INDEX (2017) <sup><a href="#t3">3</a></sup></h3>`
      )
      .attr("class", "chart-title");

    const svg = d3
      .select("#chart-container")
      .append("svg")
      .attr("class", "scatter")
      .attr("viewBox", [0, 0, width, height]);
    for (let d of data) {
      d.price = +d.price;
      d.fertility = +d.fertility;
    }

    const tooltip = d3.select(".svg-tooltip");

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

    var previous;
    d3.selectAll(".symbols")
      .on("mouseover", function (event, d) {
        previous = d3.select(this).style("fill");
        d3.select(this).attr("fill", "red");
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
        return d === "Regions" ? `Other area` : `${d} area`;
      })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    svg
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height - 8)
      .attr("dx", "0.5em")
      .attr("dy", "-1.5em")
      .text("Regional Difference Index of Consumer Prices (All items)");

    svg
      .append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top / 2 - 30)
      .attr("dx", "-0.5em")
      .attr("y", 25)
      .attr("transform", "rotate(-90)")
      .text("Fertility Rate (TFR)");

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

    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("y1", y(1.43))
      .attr("x2", width - margin.right)
      .attr("y2", y(1.43))
      .style("stroke-width", 0.5)
      .style("stroke", "red")
      .style("fill", "none");

    svg
      .append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "start")
      .attr("x", width - margin.right - 120)
      .attr("y", y(1.43) - 5)
      .style("text-anchor", "start")
      .text("National Average Fertility rate")
      .style("fill", "red");

    // annotations
    svg
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", margin.left + 153)
      .attr("y", margin.top + 27)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em")
      .text("Okinawa");

    svg
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "start")
      .attr("x", width - margin.right - 30)
      .attr("y", height - margin.bottom)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em")
      .text("Tokyo");
  });
}

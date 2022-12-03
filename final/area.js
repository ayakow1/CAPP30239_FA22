/* Area chart for migrations */

function create_area() {
  d3.csv("../data/migration.csv").then((data) => {
    const height = 300,
      width = 600,
      margin = { top: 25, right: 50, bottom: 35, left: 55 };

    d3.select("#chart-container")
      .append("div")
      .html(
        `<h3>NUMBER OF NET MIGRATION WITHIN COUNTRY <sup><a href="#t4">4</a></sup></h3>`
      )
      .attr("class", "chart-title");

    const svg = d3
      .select("#chart-container")
      .append("svg")
      .attr("viewBox", [0, 0, width, height]);

    for (let d of data) {
      d.Value = +d.Value;
      d.Year = new Date(+d.Year, 0, 1);
    }

    let locations = ["Tokyo", "Osaka", "Nagoya", "Regions"];

    let color = {
      Tokyo: "#fb9a99",
      Nagoya: "#b2df8a",
      Osaka: "#fdbf6f",
      Regions: "#a6cee3",
    };

    let x = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => d.Year))
      .range([margin.left, width - margin.right]);

    let y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Value))
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).tickSizeOuter(0));

    let area = d3
      .area()
      .x((d) => x(d.Year))
      .y0(y(0)) //start at base line
      .y1((d) => y(d.Value));

    // construct area chart for each location
    for (let location of locations) {
      let locationData = data.filter((d) => d.Location === location);
      let c = color[location];

      let g = svg
        .append("g")
        .attr("class", "location")
        .on("mouseover", function () {
          d3.selectAll(".highlight").classed("highlight", false);
          d3.select(this).classed("highlight", true);
        })
        .on("mouseleave", function () {
          d3.select(this).classed("highlight", false);
          d3.selectAll(".Tokyo").classed("highlight", true);
        });

      if (location === "Tokyo") {
        g.attr("class", "Tokyo");
        d3.selectAll(".Tokyo").classed("highlight", true);
      }

      g.append("path")
        .datum(locationData)
        .attr("d", area)
        .attr("fill", c)
        .attr("opacity", 0.3)
        .attr("stroke", "#696969");
    }

    // Manual legend
    svg
      .append("circle")
      .attr("cx", width - 80)
      .attr("cy", 30)
      .attr("r", 3)
      .style("fill", color["Tokyo"]);
    svg
      .append("circle")
      .attr("cx", width - 80)
      .attr("cy", 45)
      .attr("r", 3)
      .style("fill", color["Nagoya"]);
    svg
      .append("circle")
      .attr("cx", width - 80)
      .attr("cy", 60)
      .attr("r", 3)
      .style("fill", color["Osaka"]);
    svg
      .append("circle")
      .attr("cx", width - 80)
      .attr("cy", 75)
      .attr("r", 3)
      .style("fill", color["Regions"]);
    svg
      .append("text")
      .attr("x", width - 75)
      .attr("y", 30)
      .text("Tokyo area")
      .style("font-size", "8px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", width - 75)
      .attr("y", 45)
      .text("Nagoya area")
      .style("font-size", "8px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", width - 75)
      .attr("y", 60)
      .text("Osaka area")
      .style("font-size", "8px")
      .attr("alignment-baseline", "middle");
    svg
      .append("text")
      .attr("x", width - 75)
      .attr("y", 75)
      .text("Other area")
      .style("font-size", "8px")
      .attr("alignment-baseline", "middle");

    // Add axis labels
    svg
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right + 2)
      .attr("y", height - 2)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em")
      .text("Year");

    svg
      .append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top / 2 - 10)
      .attr("dx", "-1em")
      .attr("y", 8)
      .attr("transform", "rotate(-90)")
      .text("Net migration (people)");
  });
}

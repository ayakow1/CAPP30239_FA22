/* Ring chart of foreign people percentage
   Reference: d3-graph-gallery.com/graph/donut_label.html */

https: function create_ring() {
  const height = 500,
    width = 550,
    margin = 20,
    padding = 50;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(width, height) / 2 - margin;

  const color = d3
    .scaleOrdinal()
    .domain(["Japanese", " Foreigners", "Uncertain"])
    .range(["#fb9a99", "#e31a1c", "#ffff99"]);

  const data = { Japanese: 121541155, Foreigners: 2402460, Uncertain: 2202484 };

  let sum = 0;

  for (const value of Object.values(data)) {
    sum += value;
  }

  d3.select("#chart-container")
    .append("div")
    .html(
      `<h3>PERCENTAGE OF FOREIGN RESIDENTS IN JAPAN <sup><a href="#t1">2</a></sup></h3>`
    )
    .attr("class", "chart-title");

  // append the svg object to the div called 'my_dataviz'
  const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [
      -width / 2 - padding,
      -height / 2,
      width + padding * 2,
      height + padding,
    ])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .append("g");

  // Compute the position of each group on the pie:
  const pie = d3
    .pie()
    .sort(null) // Do not sort group by size
    .value((d) => d[1]);

  const data_ready = pie(Object.entries(data));

  // The arc generator
  const arc = d3
    .arc()
    .innerRadius(radius * 0.4) // This is the size of the donut hole
    .outerRadius(radius * 0.8);

  // Another arc that won't be drawn. Just for labels positioning
  const outerArc = d3
    .arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
  svg
    .selectAll("allSlices")
    .data(data_ready)
    .join("path")
    .attr("d", arc)
    .attr("fill", (d) => color(d.data[1]))
    .attr("stroke", "white")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  // Add the polylines between chart and labels:
  svg
    .selectAll("allPolylines")
    .data(data_ready)
    .join("polyline")
    .attr("stroke", "black")
    .style("fill", "none")
    .attr("stroke-width", 1)
    .attr("points", function (d) {
      const posA = arc.centroid(d); // line insertion in the slice
      const posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
      const posC = outerArc.centroid(d); // Label position = almost the same as posB
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
      posC[0] = radius * 0.95 * (d.data[0] === "Foreigners" ? -1 : 1); // multiply by 1 or -1 to put it on the right or on the left
      //   posC[1] += d.data[0] === "Uncertain" ? -5 : 0;
      return [posA, posB, posC];
    });

  // Add the polylines between chart and labels:
  svg
    .selectAll("allLabels")
    .data(data_ready)
    .join("text")
    .attr("transform", function (d) {
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] =
        (d.data[0] === "Foreigners" ? radius * 1.27 : radius * 0.99) *
        (d.data[0] === "Foreigners" ? -1 : 1);
      return `translate(${pos})`;
    })
    .style("text-anchor", function (d) {
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return d === "Foreigners" ? "end" : "start";
    })
    .selectAll("tspan")
    .data(function (d) {
      row1 = `${(d.data[1] / 1000000).toFixed(1)} MM ppl`;
      row2 = `(${((d.data[1] / sum) * 100).toFixed(1)} %)`;
      return [d.data[0], row1, row2];
    })
    .join("tspan")
    .attr("x", 0)
    .attr("y", (d, i) => `${i * 1.1}em`)
    .attr("font-weight", (d, i) => (i ? null : "bold"))
    .attr("font-size", "14px")
    .text((d) => d);

  svg
    .append("foreignObject") //put html annotation (more flexible than text)
    .attr("id", "annotation2")
    .attr("x", -75)
    .attr("y", -32)
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .style("font-size", 20)
    .attr("alignment-baseline", "middle")
    .attr("width", 150)
    .attr("height", 55)
    .append("xhtml:div") //sth needed for browser
    .append("p")
    .html(`Total residents (2020): <br> ${(sum / 1000000).toFixed(1)} MM ppl`);
}

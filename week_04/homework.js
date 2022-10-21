/* D3 Area Chart */

const height = 500,
  width = 800,
  margin = { top: 15, right: 30, bottom: 35, left: 40 };

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]); //flexible container

d3.csv("long-term-interest-canada.csv").then((data) => {
  let timeParse = d3.timeParse("%Y-%m"); //define the format to parse time data

  //parse given string data
  for (let d of data) {
    d.Value = +d.Num;
    d.Date = timeParse(d.Month);
  }

  let x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Date)) //obtain min and max at the same time
    .range([margin.left, width - margin.right]);

  let y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Value)])
    .range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.timeFormat("%b"))); //x axis label as month

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y)
        .tickFormat((d) => d + "%")
        .tickSizeOuter(0)
        .tickSize(-width) //grid line
    );

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", margin.left)
    .attr("y", height)
    .attr("dx", "0.5em")
    .attr("dy", "-0.5em")
    .text("2020"); // show year at bottom left

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top / 2)
    .attr("dx", "-0.5em")
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("Interest rate");

  let area = d3
    .area()
    .x((d) => x(d.Date)) //width is date
    .y0(y(0)) //start at base line
    .y1((d) => y(d.Value)); //height is value

  svg
    .append("path")
    .datum(data)
    .attr("d", area)
    .attr("fill", "#fbe2ff")
    .attr("stroke", "salmon")
    .style("opacity", 0.5); //add opacity
});

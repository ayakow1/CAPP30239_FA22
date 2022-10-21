/* D3 Line Chart */

const height = 500,
  width = 800,
  margin = { top: 15, right: 30, bottom: 35, left: 40 };

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("viewBox", [0, 0, width, height]); //scale svg element.

d3.csv("long-term-interest-monthly.csv").then((data) => {
  let timeParse = d3.timeParse("%Y-%m");

  for (let d of data) {
    d.Value = +d.Value;
    d.Date = timeParse(d.Date);
  }

  let x = d3
    .scaleTime()
    .domain(d3.extent(data, (d) => d.Date)) //used to returns the minimum and maximum value in an array
    .range([margin.left, width - margin.right]);

  let y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.Value)])
    .range([height - margin.bottom, margin.top]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`) //to put x axis on right place x=0, y=h-margin
    .call(d3.axisBottom(x).tickSizeOuter(0)); //ticksizeouter to take the little bar out

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis") //modify style in css
    .call(
      d3
        .axisLeft(y)
        .tickSizeOuter(0)
        .tickFormat((d) => d + "%")
        .tickSize(-width)
    );

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width - margin.right)
    .attr("y", height)
    .attr("dx", "0.5em")
    .attr("dy", "-1em")
    .text("Year");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top / 2)
    .attr("dx", "-0.5em")
    .attr("y", 10)
    .attr("transform", "rotate(-90)")
    .text("Interest rate");

  let line = d3
    .line()
    .x((d) => x(d.Date))
    .y((d) => y(d.Value))
    .curve(d3.curveBasis); //https://github.com/d3/d3-shape/blob/master/README.md#curves

  svg
    .append("path")
    .datum(data) //instead of data(). bind a single data value to a single element.
    .attr("d", line)
    .attr("fill", "none") //must be none otherwise use default black.
    .attr("stroke", "steelblue");
});

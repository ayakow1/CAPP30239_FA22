/* Calendar chart for police shooting */
d3.csv("police_date.csv").then((data) => {
  let timeParse = d3.timeParse("%Y-%m-%d");

  let chart = Calendar(data, {
    x: (d) => timeParse(d.Date),
    y: (d) => d.Count,
    cellsize: 30,
  });

  document.getElementById("calender").appendChild(chart);
});

/*Legend
    https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient/ */
let width = 100,
  height = 30,
  margin = 10;

const svg = d3
  .select("#legend")
  .append("svg")
  .attr("width", width + margin * 3)
  .attr("height", height + margin * 3)
  .append("g")
  .attr("transform", "translate(" + margin * 2 + "," + margin * 2 + ")");

//Append a defs (for definition) element to your SVG
var defs = svg.append("defs");

//Append a linearGradient element to the defs and give it a unique id
var linearGradient = defs
  .append("linearGradient")
  .attr("id", "linear-gradient");

//Set the color for the start (0%)
linearGradient.append("stop").attr("offset", "0%").attr("stop-color", "white"); //light blue
//Set the color for the end (25%)
linearGradient
  .append("stop")
  .attr("offset", "25%")
  .attr("stop-color", "#094487");

//Set the color for the end (100%)
linearGradient
  .append("stop")
  .attr("offset", "200%")
  .attr("stop-color", "#08306b");

//Draw the rectangle and fill with gradient
svg
  .append("rect")
  .attr("width", 300)
  .attr("height", 15)
  .style("fill", "url(#linear-gradient)");

svg
  .append("text")
  .text("Number of People")
  .attr("x", 4)
  .attr("y", -6)
  .attr("dominant-baseline", "middle")
  .attr("fill", "white");

svg
  .append("text")
  .text("0")
  .attr("x", 3)
  .attr("y", 21)
  .attr("dominant-baseline", "middle")
  .attr("fill", "white");

svg
  .append("text")
  .text("14")
  .attr("x", width - 3)
  .attr("y", 21)
  .attr("dominant-baseline", "middle")
  .attr("fill", "white");

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/calendar-view
function Calendar(
  data,
  {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    title, // given d in data, returns the title text
    width = 928, // width of the chart, in pixels
    cellSize = 17, // width and height of an individual day, in pixels
    weekday = "monday", // either: weekday, sunday, or monday
    formatDay = (i) => "SMTWTFS"[i], // given a day number in [0, 6], the day-of-week label
    formatMonth = "%b", // format specifier string for months (above the chart)
    yFormat, // format specifier string for values (in the title)
    colors = d3.interpolateBlues,
  } = {}
) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(X.length);

  const countDay = weekday === "sunday" ? (i) => i : (i) => (i + 6) % 7;
  const timeWeek = weekday === "sunday" ? d3.utcSunday : d3.utcMonday;
  const weekDays = weekday === "weekday" ? 5 : 7;
  const height = cellSize * (weekDays + 2);

  // Compute a color scale. This assumes a diverging color scheme where the pivot
  // is zero, and we want symmetric difference around zero.
  const max = d3.quantile(Y, 0.9975, Math.abs);
  const color = d3.scaleSequential([0, +max], colors).unknown("none");

  // Construct formats.
  formatMonth = d3.utcFormat(formatMonth);

  // Compute titles.
  if (title === undefined) {
    const formatDate = d3.utcFormat("%B %-d, %Y");
    const formatValue = color.tickFormat(100, yFormat);
    title = (i) => `${formatDate(X[i])}\n${formatValue(Y[i])}`;
  } else if (title !== null) {
    const T = d3.map(data, title);
    title = (i) => T[i];
  }

  // Group the index by year, in reverse input order. (Assuming that the input is
  // chronological, this will show years in reverse chronological order.)
  var years = d3.groups(I, (i) => X[i].getUTCFullYear()).reverse();

  function pathMonth(t) {
    const d = Math.max(0, Math.min(weekDays, countDay(t.getUTCDay())));
    const w = timeWeek.count(d3.utcYear(t), t);
    return `${
      d === 0
        ? `M${w * cellSize},0`
        : d === weekDays
        ? `M${(w + 1) * cellSize},0`
        : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`
    }V${weekDays * cellSize}`;
  }

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height * years.length)
    .attr("viewBox", [0, 0, width, height * years.length])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;")
    .attr("fill", "white");
  // .attr("font-family", "sans-serif")
  // .attr("font-size", 10);

  const year = svg
    .selectAll("g")
    .data(years)
    .join("g")
    .attr(
      "transform",
      (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`
    );

  year
    .append("text")
    .attr("x", -5)
    .attr("y", -5)
    .attr("font-weight", "bold")
    .attr("text-anchor", "end")
    .text(([key]) => key);

  year
    .append("g")
    .attr("text-anchor", "end")
    .selectAll("text")
    .data(weekday === "weekday" ? d3.range(1, 6) : d3.range(7))
    .join("text")
    .attr("x", -5)
    .attr("y", (i) => (countDay(i) + 0.5) * cellSize)
    .attr("dy", "0.31em")
    .text(formatDay);

  const cell = year
    .append("g")
    .selectAll("rect")
    .data(
      weekday === "weekday"
        ? ([, I]) => I.filter((i) => ![0, 6].includes(X[i].getUTCDay()))
        : ([, I]) => I
    )
    .join("rect")
    .attr("width", cellSize - 1)
    .attr("height", cellSize - 1)
    .attr("x", (i) => timeWeek.count(d3.utcYear(X[i]), X[i]) * cellSize + 0.5)
    .attr("y", (i) => countDay(X[i].getUTCDay()) * cellSize + 0.5)
    .attr("fill", (i) => color(Y[i]));

  if (title) cell.append("title").text(title);

  const month = year
    .append("g")
    .selectAll("g")
    .data(([, I]) => d3.utcMonths(d3.utcMonth(X[I[0]]), X[I[I.length - 1]]))
    .join("g");

  month
    .filter((d, i) => i)
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "#fff")
    .attr("stroke-width", 3)
    .attr("d", pathMonth);

  month
    .append("text")
    .attr(
      "x",
      (d) => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2
    )
    .attr("y", -5)
    .text(formatMonth);

  return Object.assign(svg.node(), { scales: { color } });
}

/* Bar chart for COVID country cases*/

d3.csv("covid.csv").then((data) => {
  for (let d of data) {
    d.cases = +d.cases; //force a number
  }

  // console.log(data);

  //   const height = 400;
  //   const width = 800;

  const height = 400,
    width = 800,
    margin = { top: 25, right: 30, bottom: 35, left: 50 }; //think like a clock

  let svg = d3
    .select("#chart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]); //dynamic grow and shrink, start at 0,0 and grow proportionate to width and height

  let x = d3
    .scaleBand() //1st: domain (data 0, 1000), 2nd range (pixel space to take up)
    .domain([]) //get each row and put it into domain
    .range([margin.left, width - margin.right])
    .padding(0.1);

  let y = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.cases)]) // function(d) {return d.cases}
    .nice()
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

  let bar = svg
    .selectAll(".bar")
    .append("g") // appending a group
    .data(data)
    .join("g")
    .attr("class", "bar");

  bar
    .append("rect")
    .attr("fill", "steelblue")
    .attr("x", (d) => x(d.country))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d.cases))
    .attr("height", (d) => y(0) - y(d.cases));
});

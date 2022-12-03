/* Line chart population/fertility projections */

function create_line() {
  Promise.all([
    d3.csv("../data/prediction_line.csv"),
    d3.csv("../data/prediction_f_line.csv"),
  ]).then(([population, fertility]) => {
    let height = 250,
      width = 570,
      margin = { top: 10, right: 30, bottom: 50, left: 55 },
      padding = 50;

    d3.select("#chart-container").append("div").attr("class", "linechart");

    d3.select(".linechart")
      .append("div")
      .html(
        `<h3>ACTUAL VS PAST PROJECTION FOR POPULATION AND FERTILITY RATE <sup><a href="#t6">6</a></sup></h3>`
      )
      .attr("id", "line-chart-title");

    const timeParse = d3.timeParse("%Y");

    const color = {
      Actual: "#737373",
      1997: "#b15928",
      2002: "#b2df8a",
      2006: "#ff7f00",
      2012: "#cab2d6",
      2017: "#fb9a99",
    };

    createChart3(true); //chart for population
    createChart3(false); //chart for fertility

    function createChart3(isPopulation) {
      const svg = d3
        .select(".linechart")
        .append("div")
        .html(isPopulation ? `<h3>Population</h3>` : `<h3>Fertility rate</h3>`)
        .attr("class", "line-each")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

      let x = d3
        .scaleTime()
        .domain([new timeParse("1996"), new timeParse("2045")])
        .range([margin.left, width - padding]);

      let y = d3
        .scaleLinear()
        .domain(isPopulation ? [100000, 130000] : [1.2, 1.7])
        .range([height - margin.bottom, margin.top]);

      svg
        .append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(
          d3.axisBottom(x).tickSizeOuter(0).tickFormat(d3.timeFormat("%Y"))
        );

      svg
        .append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(
          d3
            .axisLeft(y)
            .tickValues(
              isPopulation
                ? [100000, 105000, 110000, 115000, 120000, 125000, 130000]
                : [1.2, 1.3, 1.4, 1.5, 1.6, 1.7]
            )
        );

      svg
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right + 5)
        .attr("y", height - margin.bottom + 34)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em")
        .text("Year");

      svg
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top / 2 - 15)
        .attr("dx", "-1em")
        .attr("y", 7)
        .attr("transform", "rotate(-90)")
        .text(isPopulation ? "Thousand People" : "Fertility rate");

      // Draw each line
      let predictions = new Set();

      const data = isPopulation ? population : fertility;

      for (let d of data) {
        d.YearParse = timeParse(d.Year);
        d.value = +d.value;
        predictions.add(d.variable);
      }

      let line = d3
        .line()
        .defined((d) => d.value > 0) //deal with missing values
        .x((d) => x(d.YearParse))
        .y((d) => y(d.value));

      for (let prediction of predictions) {
        let predictionData = data.filter((d) => d.variable === prediction);

        let g = svg.append("g").on("mouseover", function () {
          // set/remove highlight class
          // highlight class defined in html
          d3.selectAll(".highlight2").classed("highlight2", false);
          d3.select(this).classed("highlight2", true);
        });

        g.append("path")
          .datum(predictionData)
          .attr("fill", "none")
          .attr("stroke", color[prediction])
          .attr("d", line);

        // For past projections add dashed lines
        if (prediction != "Actual") {
          g.attr("class", "prediction").attr("stroke-dasharray", "5,2");
        }

        // For actual data add bold lines
        if (prediction === "Actual") {
          g.attr("stroke-width", "1.5");

          // Add label
          g.append("text")
            .text("Actual")
            .attr("text-anchor", "end")
            .attr("x", x(new timeParse("2022")) + 29)
            .attr("dx", "-1em")
            .attr("y", isPopulation ? 40 : 165);
        }

        let lastEntry = predictionData[predictionData.length - 1]; //last piece of data to position text x and y

        // Add label
        g.append("text")
          .text(prediction)
          .attr("x", x(lastEntry.YearParse) + 3)
          .attr("y", y(lastEntry.value))
          .attr("dominant-baseline", "middle")
          .attr("fill", color[prediction]);
      }

      // Manual legend
      if (isPopulation) {
        svg
          .append("line")
          .style("stroke", "black")
          .attr("x1", width - margin.right * 6)
          .attr("y1", margin.top - 5)
          .attr("x2", width - margin.right * 6 + 20)
          .attr("y2", margin.top - 5);

        svg
          .append("line")
          .style("stroke", "black")
          .attr("stroke-dasharray", "5,2")
          .attr("x1", width - margin.right * 6)
          .attr("y1", margin.top + 5)
          .attr("x2", width - margin.right * 6 + 20)
          .attr("y2", margin.top + 5);

        svg
          .append("text")
          .attr("text-anchor", "start")
          .attr("x", width - margin.right * 6 + 30)
          .attr("y", margin.top - 3)
          .attr("font-size", 12)
          .text("Actual data");

        svg
          .append("text")
          .attr("text-anchor", "start")
          .attr("x", width - margin.right * 6 + 30)
          .attr("y", margin.top + 8)
          .attr("font-size", 12)
          .text("Projected data released in past years");
      }
    }
  });
}

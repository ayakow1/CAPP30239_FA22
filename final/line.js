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
        `<h3>ACTUAL VS PROJECTED POPULATION AND FERTILITY RATE <sup><a href="#t6">6</a></sup></h3>`
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

    createChart3(true);
    createChart3(false);

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

      createLine(isPopulation);

      function createLine(isPopulation) {
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

          if (prediction != "Actual") {
            let g = svg
              .append("g")
              .attr("class", "prediction")
              .append("path")
              .datum(predictionData)
              .attr("fill", "none")
              .attr("stroke", color[prediction])
              .attr("d", line)
              .attr("stroke-dasharray", "5,2");
          }

          if (prediction === "Actual") {
            let g = svg
              .append("g")
              .attr("class", "prediction")
              .append("path")
              .datum(predictionData)
              .attr("fill", "none")
              .attr("stroke", color[prediction])
              .attr("d", line);
            g.attr("stroke-width", "1.5");

            svg
              .append("text")
              .attr("class", "line-label")
              .attr("text-anchor", "end")
              .attr("x", x(new timeParse("2022")) + 29)
              .attr("dx", "-1em")
              .attr("y", isPopulation ? 40 : 165)
              .text("Actual");
          }

          let lastEntry = predictionData[predictionData.length - 1]; //last piece of data to position text x and y

          svg
            .append("text")
            .attr("class", "line-label")
            .text(prediction)
            .attr("x", x(lastEntry.YearParse) + 3)
            .attr("y", y(lastEntry.value))
            .attr("dominant-baseline", "middle")
            .attr("fill", color[prediction]);
        }
      }
    }
  });
}

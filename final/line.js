Promise.all([
  d3.csv("../data/prediction_line.csv"),
  d3.csv("../data/prediction_f_line.csv"),
]).then(([population, fertility]) => {
  let height = 400,
    width = 1300,
    margin = { top: 60, right: 30, bottom: 50, left: 55 },
    padding = 50;

  const svg = d3
    .select("#linechart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  const timeParse = d3.timeParse("%Y");

  let x1 = d3
    .scaleTime()
    .domain([new timeParse("1996"), new timeParse("2045")])
    .range([margin.left, width / 2 - padding]);

  let x2 = d3
    .scaleTime()
    .domain([new timeParse("1996"), new timeParse("2045")])
    .range([width / 2 + padding, width - margin.right]);

  let y1 = d3
    .scaleLinear()
    .domain([100000, 130000])
    .range([height - margin.bottom, margin.top]);

  let y2 = d3
    .scaleLinear()
    .domain([1.2, 1.7])
    .range([height - margin.bottom, margin.top]);

  const color = {
    Actual: "#737373",
    1997: "#b15928",
    2002: "#b2df8a",
    2006: "#ff7f00",
    2012: "#cab2d6",
    2017: "#fb9a99",
  };

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x1).tickSizeOuter(0).tickFormat(d3.timeFormat("%Y")));

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x2).tickSizeOuter(0).tickFormat(d3.timeFormat("%Y")));

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y1)
        .tickValues([100000, 105000, 110000, 115000, 120000, 125000, 130000])
    );

  svg
    .append("g")
    .attr("transform", `translate(${width / 2 + padding},0)`)
    .call(d3.axisLeft(y2).tickValues([1.2, 1.3, 1.4, 1.5, 1.6, 1.7]));

  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "center")
    .attr("x", margin.left + 175)
    .attr("y", margin.top - 20)
    .text("Projections of Population");

  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "center")
    .attr("x", width / 2 + 240)
    .attr("y", margin.top - 20)
    .text("Projections of Fertility rate");

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 - margin.right - 15)
    .attr("y", height - margin.bottom + 34)
    .attr("dx", "0.5em")
    .attr("dy", "-0.5em")
    .text("Year");

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
    .text("Thousand People");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top / 2 - 15)
    .attr("dx", "-1em")
    .attr("y", width / 2 - 3)
    .attr("transform", "rotate(-90)")
    .text("Fertility rate");

  createLine(population, true);
  createLine(fertility, false);

  function createLine(data, isPopulation) {
    let predictions = new Set();

    for (let d of data) {
      d.YearParse = timeParse(d.Year);
      d.value = +d.value;
      predictions.add(d.variable);
    }

    let line = d3
      .line()
      .defined((d) => d.value > 0) //deal with missing values
      .x((d) => (isPopulation ? x1(d.YearParse) : x2(d.YearParse)))
      .y((d) => (isPopulation ? y1(d.value) : y2(d.value)));

    for (let prediction of predictions) {
      let predictionData = data.filter((d) => d.variable === prediction);

      if (prediction != "Actual") {
        let g = svg
          .append("g")
          .attr("class", "prediction")
          //   .on("mouseover", function (d) {
          //     svg
          //       .append("text")
          //       .attr("class", "title-text")
          //       .style("fill", color[prediction])
          //       .text(prediction)
          //       .attr("text-anchor", "middle")
          //       .attr("x", d.x - 10 + "px")
          //       .attr("y", d.y - 10 + "px");
          //     d3.select(this).attr("stroke-dashoffset", 0);
          //   })
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
          .attr(
            "x",
            isPopulation
              ? x1(new timeParse("2022")) + 28
              : x2(new timeParse("2022")) + 25
          )
          .attr("dx", "-1em")
          .attr("y", isPopulation ? 102 : 295)
          .text("Actual");
      }

      let lastEntry = predictionData[predictionData.length - 1]; //last piece of data to position text x and y

      console.log(lastEntry);
      svg
        .append("text")
        .attr("class", "line-label")
        .text(prediction)
        .attr(
          "x",
          isPopulation
            ? x1(lastEntry.YearParse) + 3
            : x2(lastEntry.YearParse) + 3
        )
        .attr(
          "y",
          isPopulation
            ? prediction == "1997"
              ? y1(lastEntry.value) + 5
              : y1(lastEntry.value) - 1
            : y2(lastEntry.value)
        )
        .attr("dominant-baseline", "middle")
        .attr("fill", color[prediction]);
    }
  }
});

/* Area chart for time*/

d3.json("../data/time.json").then((data) => {
  const height = 500,
    width = 1300,
    margin = { top: 25, right: 30, bottom: 50, left: 30 },
    padding = 20;

  const svg = d3
    .select("#stackedareachart")
    .append("svg")
    .attr("viewBox", [0, 0, width, height]);

  let timeParse = d3.timeParse("%H:%M");

  const x1 = d3
    .scaleTime()
    .range([margin.left, width / 2 - padding])
    .domain([new timeParse("0:00"), new timeParse("23:45")]);

  const x2 = d3
    .scaleTime()
    .range([width / 2 + padding, width - margin.right])
    .domain([new timeParse("0:00"), new timeParse("23:45")]);

  const y = d3
    .scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([0.0, 100.0]);

  svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(
      d3
        .axisLeft(y)
        .tickSize(0)
        .tickFormat((d) => d + "%")
    );

  svg
    .append("g")
    .attr("transform", `translate(${width / 2 + padding},0)`)
    .call(
      d3
        .axisLeft(y)
        .tickSize(0)
        .tickFormat((d) => d + "%")
    );

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom + 5})`)
    .call(d3.axisBottom(x1).tickSizeOuter(5).tickFormat(d3.timeFormat("%H")));

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom + 5})`)
    .call(d3.axisBottom(x2).tickSizeOuter(5).tickFormat(d3.timeFormat("%H")));

  const areaGroups1 = svg.append("g").attr("class", "area-group");
  const areaGroups2 = svg.append("g").attr("class", "area-group");

  function updateChart(work, child) {
    let subset = data[work][child];

    for (let gender of genders) {
      eachFacet(gender);
    }

    function eachFacet(gender) {
      let facet = subset[gender];
      console.log(facet);
      for (let d of facet) {
        d.Time = timeParse(d.Time);
        d.Child_care = +d.Child_care;
        d.Eating = +d.Eating;
        d.Hobby = +d.Hobby;
        d.Household_activities = +d.Household_activities;
        d.Others = +d.Others;
        d.Relaxing = +d.Relaxing;
        d.Shopping = +d.Shopping;
        d.Sleep = +d.Sleep;
        d.TV = +d.TV;
        d.Traveling = +d.Traveling;
        d.Washing = +d.Washing;
        d.Work = +d.Work;
      }

      let stackedData = d3.stack().keys(actions)(facet);

      const color = d3.scaleOrdinal(actions, [
        "#e31a1c",
        "#1f78b4",
        "#b2df8a",
        "#33a02c",
        "#fb9a99",
        "#a6cee3",
        "#fdbf6f",
        "#ff7f00",
        "#cab2d6",
        "#6a3d9a",
        "#ffff99",
        "#b15928",
      ]);

      // Show the areas
      (gender == "wife" ? areaGroups1 : areaGroups2)
        .selectAll("g")
        .data(stackedData)
        .join(
          (enter) => {
            let g = enter.append("g");
            g.append("path")
              .style("fill", function (d) {
                return color(d.key);
              })
              .style("opacity", 0.5)
              .attr(
                "d",
                d3
                  .area()
                  .x(function (d) {
                    if (gender == "wife") {
                      return x1(d.data.Time);
                    } else {
                      return x2(d.data.Time);
                    }
                  })
                  .y0(function (d) {
                    return y(d[0]);
                  })
                  .y1(function (d) {
                    return y(d[1]);
                  })
              )
              .transition()
              .duration(750);
          },
          (update) => {
            update
              .selectAll("path")
              .transition()
              .duration(750)
              .attr(
                "d",
                d3
                  .area()
                  .x(function (d) {
                    if (gender == "wife") {
                      return x1(d.data.Time);
                    } else {
                      return x2(d.data.Time);
                    }
                  })
                  .y0(function (d) {
                    return y(d[0]);
                  })
                  .y1(function (d) {
                    return y(d[1]);
                  })
              );
          },
          (exit) => {
            //clear from the page
            exit
              .selectAll("path")
              .transition()
              .duration(750)
              .attr(
                "d",
                d3
                  .area()
                  .x(function (d) {
                    if (gender == "wife") {
                      return x1(d.data.Time);
                    } else {
                      return x2(d.data.Time);
                    }
                  })
                  .y0(y(height - margin.bottom))
                  .y1(y(height - margin.bottom))
              );

            exit.transition().duration(750).remove();
          }
        );
    }
  }

  updateChart("Both working", "-6");

  // event listener
  d3.selectAll("input[name='work']") //selecting the work radio
    .on("change", function (event) {
      const work = event.target.value;
      const child = d3.select("input[name='child']:checked").attr("value");
      updateChart(work, child);
    });
  // event listener2
  d3.selectAll("input[name='child']") //selecting the child radio
    .on("change", function (event) {
      const child = event.target.value;
      const work = d3.select("input[name='work']:checked").attr("value");
      updateChart(work, child);
    });
});

var genders = ["husband", "wife"];

var actions = [
  "Child_care",
  "Eating",
  "Hobby",
  "Household_activities",
  "Others",
  "Relaxing",
  "Shopping",
  "Sleep",
  "TV",
  "Traveling",
  "Washing",
  "Work",
];

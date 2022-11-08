/* Area chart for time
    Reference: https://d3-graph-gallery.com/graph/stackedarea_wideinput.html*/

d3.json("../data/time.json").then((data) => {
  const height = 500,
    width = 1300,
    margin = { top: 60, right: 30, bottom: 50, left: 45 },
    padding = 30;

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
    .call(
      d3.axisBottom(x1).tickSizeOuter(5).tickFormat(d3.timeFormat("%I %p"))
    );

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom + 5})`)
    .call(
      d3.axisBottom(x2).tickSizeOuter(5).tickFormat(d3.timeFormat("%I %p"))
    );

  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "center")
    .attr("x", margin.left + 210)
    .attr("y", margin.top - 5)
    .text("Daily schedule of wife");

  svg
    .append("text")
    .attr("class", "chart-title")
    .attr("text-anchor", "center")
    .attr("x", width / 2 + 220)
    .attr("y", margin.top - 5)
    .text("Daily schedule of husband");

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 - margin.right - 5)
    .attr("y", height - margin.bottom + 25)
    .attr("dx", "0.5em")
    .attr("dy", "-0.5em")
    .text("Time");

  svg
    .append("text")
    .attr("class", "x-label")
    .attr("text-anchor", "end")
    .attr("x", width - margin.right - 5)
    .attr("y", height - margin.bottom + 25)
    .attr("dx", "0.5em")
    .attr("dy", "-0.5em")
    .text("Time");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top / 2 - 15)
    .attr("dx", "-1em")
    .attr("y", 9)
    .attr("transform", "rotate(-90)")
    .text("Proportion of People");

  svg
    .append("text")
    .attr("class", "y-label")
    .attr("text-anchor", "end")
    .attr("x", -margin.top / 2 - 15)
    .attr("dx", "-1em")
    .attr("y", width / 2 - 3)
    .attr("transform", "rotate(-90)")
    .text("Proportion of People");

  const areaGroups1 = svg.append("g").attr("class", "area-group");
  const areaGroups2 = svg.append("g").attr("class", "area-group");

  const color = d3.scaleOrdinal(actions, [
    "#e31a1c",
    "#33a02c",
    "#bdbdbd",
    "#b2df8a",
    "#fb9a99",
    "#a6cee3",
    "#fdbf6f",
    "#fff7ec",
    "#cab2d6",
    "#bc80bd",
    "#ffff99",
    "#b15928",
  ]);

  const tooltip = d3
    .select("#stackedareachart")
    .append("div")
    .attr("class", "svg-tooltip3")
    .style("position", "absolute")
    .style("visibility", "hidden");

  function updateChart(work, child) {
    let subset = data[work][child];

    for (let gender of genders) {
      eachFacet(gender);
    }

    function eachFacet(gender) {
      let facet = subset[gender];

      for (let d of facet) {
        d.TimeParse = timeParse(d.Time);
      }

      let stackedData = d3.stack().keys(actions)(facet);

      // Show the areas
      (gender == "wife" ? areaGroups1 : areaGroups2)
        .selectAll("path")
        .data(stackedData)
        .join((enter) => {
          return enter.append("path").attr("class", "stackedarea");
        })
        .transition()
        .duration(500)
        .attr(
          "d",
          d3
            .area()
            .x(function (d) {
              if (gender == "wife") {
                return x1(d.data.TimeParse);
              } else {
                return x2(d.data.TimeParse);
              }
            })
            .y0(function (d) {
              return y(+d[0]);
            })
            .y1(function (d) {
              return y(+d[1]);
            })
        )
        .style("fill", function (d) {
          return color(d.key);
        })
        .style("opacity", 0.5)
        .attr("stroke", "grey")
        .attr("stroke-width", "0.2");

      d3.selectAll(".stackedarea")
        .on("mouseover", function (event, d) {
          const subgroupName = d.key;

          tooltip.style("visibility", "visible").html(`${subgroupName}`);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
        });
    }
  }

  updateChart("Both working", "-6");

  // manual legend
  let index = 0;
  let cumulate = width / 2 + 60;
  let gapcal = function (index, cumulate) {
    if (index % 6 === 3) {
      return cumulate + 60;
    } else if (index % 6 === 2) {
      return cumulate + 120;
    } else {
      return cumulate + 80;
    }
  };

  for (let action of actions) {
    svg
      .append("rect")
      .attr("width", 6)
      .attr("height", 6)
      .attr("x", gapcal(index, cumulate))
      .attr("y", index < 6 ? 2 : 17)
      .attr("fill", color(action))
      .attr("stroke", "black")
      .attr("stroke-width", "0.5")
      .style("opacity", 0.5);
    svg
      .append("text")
      .attr("x", gapcal(index, cumulate + 10))
      .attr("y", index < 6 ? 9 : 24)
      .text(`${action}`)
      .style("font-size", "12px")
      .attr("alignment-baseline", "start");

    if (index === 5) {
      cumulate = width / 2 + 60;
    } else {
      cumulate = gapcal(index, cumulate);
    }
    index++;
  }

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
  "Household_activities",
  "Eating",
  "Hobby",

  "Others",
  "Relaxing",
  "Shopping",
  "Sleep",
  "TV",
  "Traveling",
  "Washing",
  "Work",
];

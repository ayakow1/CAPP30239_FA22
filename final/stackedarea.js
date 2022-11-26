/* Area chart for time
    Reference: https://d3-graph-gallery.com/graph/stackedarea_wideinput.html*/

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

var actions_fortooltip = {
  Child_care: "Child care",
  Household_activities: "Household activities",
  Eating: "Eating",
  Hobby: "Hobby, Sports, Socializing",
  Others: "Others (Study, Volunteers, Medical Treatment)",
  Relaxing: "Relaxing",
  Shopping: "Shopping",
  Sleep: "Sleep",
  TV: "TV, Radio, Newspaper, Magazines",
  Traveling: "Traveling",
  Washing: "Washing, Bathing, etc",
  Work: "Work",
};

var color = d3.scaleOrdinal(actions, [
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

function create_stackedarea() {
  d3.json("../data/time.json").then((data) => {
    const height = 200,
      width = 530,
      margin = { top: 10, right: 30, bottom: 40, left: 45 },
      padding = 0;

    d3.select("#chart-container").append("div").attr("id", "area-container");

    const tooltip = d3.select(".svg-tooltip");

    d3.select("#area-container")
      .append("div")
      .html(`<h3>PROPORTION OF WIVES AND HUSBANDS SPENDING IN ACTIONS</h3>`)
      .attr("class", "chart-title");

    document.getElementById("area-container").innerHTML += `<div id="radio">
                            <p>
                            <div>
                                Work status:
                                &nbsp;<input type="radio" name="work" value="Both working" checked="checked">
                                    Both working
                                &nbsp;<input type="radio" name="work" value="Only woman is unemployed">
                                    Only woman is unemployed
                            </div>
                            <div>
                                Last Child's Age:
                                <input type="radio" name="child" value="-6"  checked="checked">
                                    0-6
                                <input type="radio" name="child" value="6-17">
                                    6-17
                                <input type="radio" name="child" value="18-">
                                    18-
                            </div>
                            </p>
                        </div>`;

    const legend2 = d3
      .select("#area-container")
      .append("svg")
      .attr("class", "legend2")
      .attr("viewBox", [0, 0, 500, 30]);

    // manual legend
    let index = 0;
    let cumulate = 60;
    let gapcal = function (index, cumulate) {
      if (index % 6 === 3) {
        return cumulate + 40;
      } else if (index % 6 === 2) {
        return cumulate + 100;
      } else {
        return cumulate + 60;
      }
    };

    for (let action of actions) {
      legend2
        .append("rect")
        .attr("width", 5)
        .attr("height", 5)
        .attr("x", gapcal(index, cumulate))
        .attr("y", index < 6 ? 2 : 17)
        .attr("fill", color(action))
        .attr("stroke", "black")
        .attr("stroke-width", "0.5")
        .style("opacity", 0.7);

      legend2
        .append("text")
        .attr("x", gapcal(index, cumulate + 10))
        .attr("y", index < 6 ? 9 : 24)
        .text(`${action}`)
        .style("font-size", "8px")
        .attr("alignment-baseline", "start");

      if (index === 5) {
        cumulate = 60;
      } else {
        cumulate = gapcal(index, cumulate);
      }
      index++;
    }

    d3.select("#area-container").append("div").attr("class", "row2");

    const timeParse = d3.timeParse("%H:%M");

    createChart2("wife");
    createChart2("husband");

    function createChart2(gender) {
      const svg = d3
        .select(".row2")
        .append("div")
        .html(
          gender === "wife"
            ? `<h3>Daily Schedule of Wife</h3>`
            : `<h3>Daily Schedule of Husband</h3>`
        )
        .attr("class", "stackedarea-each")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

      const x = d3
        .scaleTime()
        .range([margin.left, width - padding])
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
        .attr("transform", `translate(0,${height - margin.bottom + 5})`)
        .call(
          d3.axisBottom(x).tickSizeOuter(5).tickFormat(d3.timeFormat("%I %p"))
        );

      svg
        .append("text")
        .attr("class", "x-label")
        .attr("text-anchor", "end")
        .attr("x", width - margin.right + 20)
        .attr("y", height - margin.bottom + 15)
        .attr("dx", "0.5em")
        .attr("dy", "-0.5em")
        .text("Time");

      svg
        .append("text")
        .attr("class", "y-label")
        .attr("text-anchor", "end")
        .attr("x", -margin.top / 2 - 15)
        .attr("dx", "-1em")
        .attr("y", 15)
        .attr("transform", "rotate(-90)")
        .text("Proportion of People");

      svg
        .append("g")
        .attr("class", gender == "wife" ? "areaGroups1" : "areaGroups2");

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

      function updateChart(work, child) {
        let subset = data[work][child];

        eachFacet("wife");
        eachFacet("husband");

        function eachFacet(gender) {
          let facet = subset[gender];

          for (let d of facet) {
            d.TimeParse = timeParse(d.Time);
          }
          let stackedData = d3.stack().keys(actions)(facet);

          // Show the areas
          d3.select(gender == "wife" ? ".areaGroups1" : ".areaGroups2")
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
                  return x(d.data.TimeParse);
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
            .style("opacity", 0.7)
            .attr("stroke", "grey")
            .attr("stroke-width", "0.2");

          d3.selectAll(".stackedarea")
            .on("mouseover", function (event, d) {
              const subgroupName = d.key;

              tooltip
                .style("visibility", "visible")
                .html(`${actions_fortooltip[subgroupName]}`);
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
    }
  });
}

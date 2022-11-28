function create_map() {
  const height = 500,
    width = 500;

  let prefectures;
  let mesh;
  let projection;

  Promise.all([
    d3.json("../data/prediction_map.json"),
    d3.json("../data/japan.topojson"),
  ]).then(([data, japan]) => {
    prefectures = topojson.feature(japan, japan.objects.japan);
    mesh = topojson.mesh(japan, japan.objects.japan);
    projection = d3.geoMercator().fitSize([width, height], mesh);

    d3.select("#chart-container").append("div").attr("class", "map");

    d3.select(".map")
      .append("div")
      .html(
        `<h3>POPULATION CHANGE RATE BY AREA <sup><a href="#t1">1</a></sup></h3>`
      )
      .attr("class", "chart-title");

    d3.select(".map")
      .append("div")
      .attr("class", "legend")
      .node()
      .appendChild(
        Legend(d3.scaleDiverging([-0.4, 0, 0.4], d3.interpolateRdBu), {
          title: "Population change rate (base year = 2020)",
          tickFormat: "+%",
        })
      );

    d3.select(".map").append("div").attr("class", "row1");
    createChart(data, "2025");
    createChart(data, "2035");
    createChart(data, "2045");
  });

  function createChart(allData, year) {
    const data = allData[year];
    const dataById = {};
    const tooltip = d3.select(".svg-tooltip");

    for (let d of data) {
      d.rate = +d.rate;
      //making a lookup table from the array (unemployment data)
      dataById[d.id] = d;
    }

    const color = d3.scaleDiverging([-40, 0, 40], d3.interpolateRdBu);

    const path = d3.geoPath().projection(projection);

    const decimal = d3.format(",.2f");

    const svg = d3
      .select(".row1")
      .append("div")
      .html(`<h3>${year}</h3>`)
      .attr("class", "map-each")
      .append("svg")
      .attr("viewBox", [70, 30, width - 150, height - 20]);

    svg
      .append("g")
      .selectAll("path")
      .data(prefectures.features)
      .join("path")
      .attr("fill", (d) =>
        d.properties.id in dataById
          ? color(dataById[d.properties.id].rate)
          : "#ccc"
      )
      .attr("stroke", "black")
      .attr("stroke-dasharray", "2,2")
      .attr("stroke-width", "0.5")
      .attr("d", path)
      .on("mousemove", function (event, d) {
        let info = dataById[d.properties.id];
        tooltip
          .style("visibility", "visible")
          .html(`${info.nam}<br>${decimal(info.rate)}%`)
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
        d3.select(this).attr("fill", "goldenrod");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", (d) =>
          d.properties.id in dataById
            ? color(dataById[d.properties.id].rate)
            : "#ccc"
        );
      })
      .on("mouseleave", function () {
        tooltip.style("visibility", "hidden");
        d3.select(this).attr("fill", (d) =>
          d.properties.id in dataById
            ? color(dataById[d.properties.id].rate)
            : "#ccc"
        );
      });
  }
}

/* Construct sticky layout
    Reference: https://pudding.cool/process/introducing-scrollama/ */

// using d3 for convenience
var scrolly = d3.select(".section-container");
var container = document.getElementById("chart-container");
var figure = scrolly.select(".chart-container");
var article = scrolly.select(".text-container");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// generic window resize listener event
function handleResize() {
  // 1. update height of step elements
  var stepH = Math.floor(window.innerHeight * 0.75);
  step.style("height", stepH + "px");

  var figureHeight = window.innerHeight / 2;
  var figureMarginTop = (window.innerHeight - figureHeight) / 2;

  figure
    .style("height", figureHeight + "px")
    .style("top", figureMarginTop + "px");

  // 3. tell scrollama to update new element dimensions
  scroller.resize();
}

// scrollama event handlers
function handleStepEnter(response) {
  // remove elements from previous selected chart
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // make sure the tooltip is hidden
  d3.select(".svg-tooltip").style("visibility", "hidden");

  // call function and insert svg based on response.index
  if (response.index === 0) {
    create_map();
  } else if (response.index == 1) {
    create_dot();
  } else if (response.index == 2) {
    create_ring();
  } else if (response.index === 3) {
    create_scatter();
  } else if (response.index === 4) {
    create_area();
  } else if (response.index === 5) {
    create_stackedarea();
  } else if (response.index === 6) {
    create_line();
  }
}

function init() {
  handleResize();

  // Setup tooltip
  d3.select("body")
    .append("div")
    .attr("class", "svg-tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: ".section-container .text-container .step",
      offset: 0.8,
      debug: false,
    })
    .onStepEnter(handleStepEnter);

  handleResize();
}

// kick things off
init();

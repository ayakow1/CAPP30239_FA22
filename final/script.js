// using d3 for convenience
var scrolly = d3.select(".section-container");
var container = document.getElementById("chart-container");
var article = scrolly.select(".text-container");
var step = article.selectAll(".step");

// initialize the scrollama
var scroller = scrollama();

// scrollama event handlers
function handleStepEnter(response) {
  // response = { element, direction, index }

  step.classed("is-active", false);
  // add color to current step only
  step.classed("is-active", function (d, i) {
    return i === response.index;
  });
  console.log(response.index);
  if (response.index === 0) {
    console.log("here");
    const clone = document.getElementById("map").cloneNode(true);
    container.firstChild.remove();
    container.appendChild(clone);
  } else if (response.index == 1) {
    const clone = document.getElementById("dot").cloneNode(true);
    container.firstChild.remove();
    container.appendChild(clone);
  } else if (response.index === 2) {
    const clone = document.getElementById("area").cloneNode(true);
    container.firstChild.remove();
    container.appendChild(clone);
  } else if (response.index === 3) {
    const clone = document.getElementById("scat").cloneNode(true);
    container.firstChild.remove();
    container.appendChild(clone);
  } else if (response.index === 4) {
    const clone = document.getElementById("stackedarea").cloneNode(true);
    container.firstChild.remove();
    container.appendChild(clone);
  } else if (response.index === 5) {
    const clone = document.getElementById("line").cloneNode(true);
    container.firstChild.remove();
    container.appendChild(clone);
  }
}

// make sure the graphic is sticky on the right
function setupStickyfill() {
  d3.selectAll(".chart").each(function () {
    Stickyfill.add(this);
  });
}

function init() {
  setupStickyfill();
  // 1. force a resize on load to ensure proper dimensions are sent to scrollama
  const clone = document.getElementById("map").cloneNode(true);
  container.firstChild.remove();
  container.appendChild(clone);
  // 2. setup the scroller passing options
  // 		this will also initialize trigger observations
  // 3. bind scrollama event handlers (this can be chained like below)
  scroller
    .setup({
      step: ".section-container .text-container .step",
      offset: 0.5,
      debug: false,
    })
    .onStepEnter(handleStepEnter);
}

// kick things off
init();

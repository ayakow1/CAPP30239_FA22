d3.csv("race.csv").then((data) => {
    for (let d of data) {
      d.Counts =+ d.Counts //convert to number
    };

    const height = 400,
    width = 800,
    margin = ({top: 25, right: 30, bottom: 40, left: 50});

    let svg =
    d3.select("#race").append("svg").attr("viewBox", [0,0,width, height]);

    console.log(data) //make sure data is logged correctly

    /*get axis ready*/
    let x = d3.scaleBand() //scaleband divides range evenly between elements of the domain
        .domain(data.map(d => d.Race)) 
        .range([margin.left, width-margin.right]) 
        .padding(1);
    

    let y = d3.scaleLinear()
        .domain([0, d3.max(data, d=>d.Counts)]).nice() //loop through values, get max as upper limit of domain
        .range([height - margin.bottom, margin.top]);


    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .attr("class", "y-axis") // adding a class to y-axis for scoping
      .call(d3.axisLeft(y)
      );

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg
      .append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", width - margin.right)
      .attr("y", height - margin.bottom / 2 + 25)
      .attr("dx", "0.5em")
      .attr("dy", "-0.5em")
      .text("Race")
      .attr("fill", "white");
  
    svg
      .append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("x", -margin.top / 2)
      .attr("dx", "-0.5em")
      .attr("y", 8)
      .attr("transform", "rotate(-90)")
      .text("Counts")
      .attr("fill", "white");
    
    let line = d3.line()
        .x(d => x(d.Race))
        .y(d => y(d.Counts))
        .curve(d3.curveLinear);

    svg.append("path")
        .datum(data)
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "#74a9cf");

  });
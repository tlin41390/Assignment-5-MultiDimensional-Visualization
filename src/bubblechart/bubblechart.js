function main() {
    //credits to
    /* Alark Joshi's Skeleton Code
    * https://www.d3-graph-gallery.com/graph/bubble_basic.html
    */
    const canvasWidth = 700;
    const canvasHeight = 700;
    const margin = 200;

    const svg = d3.select("body").append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)

    const width = svg.attr("width") - margin;
    const height = svg.attr("height") - margin;

    //add text to the canvas for the title
    svg.append("text")
        .attr("transform", "translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size", "20px")
        .attr("font-family", "sans-serif")
        .text("Bubble Chart for Popularity of Plays")


    //create the scales for the x y and size.
    let xScale = d3.scaleLinear().range([0, width]);
    let yScale = d3.scaleLinear().range([height, 0]);
    let sizeScale = d3.scaleLinear().range([2, 10]);


    const container_g = svg.append("g")
        .attr("transform",
            "translate(100,100)");

    d3.csv("https://gist.githubusercontent.com/tlin41390/e7aebdfef38808e0d362143ce7a8b8ce/raw/98256dbdd4b8b1e91a2c94ec5b4b61f5144ca159/broadway.csv").then(data => {
        xScale.domain([1500, 15000]);
        yScale.domain([0, 100]);

        sizeScale.domain([40000, 900000]);
        const color = d3.scaleOrdinal()
            .range(["dodgerblue","limegreen","crimson"])


        //append the bubbles to the chart
        container_g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", function (d) {
                return xScale(d.Attendance);
            })
            .attr("cy", function (d) {
                return yScale(d.Capacity);
            })
            .attr("r", function (d) {
                return sizeScale(d.Gross);
            })
            //set the categorical variables for the color.
            .attr("fill",function(d) {return color(d.Type)})
            .on("mouseover", function (Event, d) {
                d3.select(this)
                    .attr("stroke", "black")
            })
            .on("mouseout", function () {
                d3.select(this)
                    .attr("stroke", "none");
            })
            .append("title")
            .text(function (d) {
                return "(Type: " + d.Type + ") (Name: " + d["Show.Name"] + ") (Earnings: " + " $" + d.Gross + ") (Theatre: " + d["Show.Theatre"] + ") (Capacity: " + d.Capacity + "%" + ") (Attendance: " + d.Attendance + ")";
            })
        //append the x axis
        container_g.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", height - 450)
            .attr("x", width - 250)
            .attr("font-size", "30px")
            .attr("stroke", "black")
            .attr("font-family", "sans-serif")
            .text("Total Attendance of That show");

        //append the y axis
        container_g.append("g")
            .call(d3.axisLeft(yScale).ticks(15))
            .append("text")
            .attr("font-size", "25px")
            .attr("transform", "rotate(-90)")
            .attr("y", 40)
            .attr("x", -100)
            .attr("dy", "-4.1em")
            .attr("stroke", "black")
            .text("Percentage of Theatre that was filled");

        container_g.append("g")
            .attr("class", "legendOrdinal")
            .attr("transform", "translate(400,200)")
            .attr("font-family","sans-serif");

        container_g.append("g")
            .attr("class","legendSize")
            .attr("font-family","sans-serif")
            .attr("transform","translate(400,300)");

        //set the color and size legend for the bubble chart
        const legendOrdinal = d3.legendColor()
            .scale(color);

        const sizeOrdinal = d3.legendSize()
            .scale(sizeScale)
            .shape('circle')
            .shapePadding(5)
            .labelOffset(10)
            .orient('vertical');


        container_g.select(".legendOrdinal")
            .call(legendOrdinal);

        container_g.select(".legendSize")
            .call(sizeOrdinal);


    })
}

main();
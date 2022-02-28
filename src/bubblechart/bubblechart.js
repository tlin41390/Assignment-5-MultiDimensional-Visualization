function main(){
    //credits to
    /* Alark Joshi's Skeleton Code
    * https://www.d3-graph-gallery.com/graph/bubble_basic.html
    */
    const canvasWidth = 700;
    const canvasHeight = 700;
    const margin = 200;

    const svg = d3.select("body").append("svg")
        .attr("width", canvasWidth)
        .attr("height",canvasHeight)

    const width = svg.attr("width") - margin;
    const height = svg.attr("height") - margin;

    //add text to the canvas for the title
    svg.append("text")
        .attr("transform","translate(100,0)")
        .attr("x",50)
        .attr("y",50)
        .attr("font-size","20px")
        .attr("font-family","sans-serif")
        .text("Bubble Chart for Car Dimension and Car HorsePower/Torque")


    //create the scales for the x y and size.
    let xScale = d3.scaleLinear().range([0,width]);
    let yScale = d3.scaleLinear().range([height,0]);
    let sizeScale = d3.scaleLinear().range([2,10]);


    const container_g = svg.append("g")
        .attr("transform",
            "translate(100,100)");

    d3.csv("https://gist.githubusercontent.com/tlin41390/e7aebdfef38808e0d362143ce7a8b8ce/raw/98256dbdd4b8b1e91a2c94ec5b4b61f5144ca159/broadway.csv").then(data=>{
        //set the domain
        xScale.domain([1500,15000]);
        yScale.domain([0,100]);

        sizeScale.domain([40000,900000]);

        //append the bubbles to the chart
        container_g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class","dot")
            .attr("cx",function(d){ return xScale(d.Attendance); })
            .attr("cy",function(d){ return yScale(d.Capacity);})
            .attr("r",function(d){ return sizeScale(d.Gross);})
            //set the categorical variables for the color.
            .attr("fill",function(d){
                if(d.Type == "Play"){
                    return "dodgerblue"
                }else if(d.Type =="Musical"){
                    return "limegreen";
                }else{
                    return "crimson";
                }
            })
        //append the x axis
        container_g.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", height-450)
            .attr("x",width-250)
            .attr("font-size","30px")
            .attr("stroke", "black")
            .attr("font-family","sans-serif")
            .text("Total Attendance of That show");

        //append the y axis
        container_g.append("g")
            .call(d3.axisLeft(yScale).ticks(15))
            .append("text")
            .attr("font-size","25px")
            .attr("transform","rotate(-90)")
            .attr("y",40)
            .attr("x",-100)
            .attr("dy","-4.1em")
            .attr("stroke","black")
            .text("Percentage of Theatre that was filled");


    })
}
main();
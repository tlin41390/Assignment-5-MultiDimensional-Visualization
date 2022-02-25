function main(){
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


    let xScale = d3.scaleLinear().range([0,width]);
    let yScale = d3.scaleLinear().range([height,0]);
    let sizeScale = d3.scaleLinear().range([2,20]);


    const container_g = svg.append("g")
        .attr("transform",
            "translate(100,100)");

    d3.csv("https://gist.githubusercontent.com/tlin41390/b7cb4fb2dd543b138a06bbcbd4ea5d17/raw/00edc0d802df72c51b35b5c3101b16ac28460ee8/cars.csv").then(data=>{
        xScale.domain([0,40]);
        yScale.domain([0,40]);
        let colorScale = d3.scaleLinear().domain([100,d3.max(data,function(d){
            return d.Horsepower;
        })]) .range(["white","blue"]);


        sizeScale.domain([100,800]);

        container_g.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class","dot")
            .attr("cx",function(d){ return xScale(d.City_MPG); })
            .attr("cy",function(d){ return yScale(d.Highway_MPG);})
            .attr("r",function(d){ return sizeScale(d.Torque);})
            .attr("fill",function(d){ return colorScale(d.Horsepower)})

        container_g.append("g")
            .attr("transform", "translate(0, " + height + ")")
            .call(d3.axisBottom(xScale))
            .append("text")
            .attr("y", height-450)
            .attr("x",width-250)
            .attr("font-size","30px")
            .attr("stroke", "black")
            .attr("font-family","sans-serif")
            .text("Miles Per Gallon In The City");

        container_g.append("g")
            .call(d3.axisLeft(yScale).ticks(15))
            .append("text")
            .attr("font-size","25px")
            .attr("transform","rotate(-90)")
            .attr("y",40)
            .attr("x",-100)
            .attr("dy","-4.1em")
            .attr("stroke","black")
            .text("Miles per Gallon In The Highway");


    })
}
main();
function main(){
    const canvasWidth = 700;
    const canvasHeight = 700;
    const margin = 200;

    const svg = d3.select("body").append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)

    const width = svg.attr("width") - margin;
    const height = svg.attr("height") - margin;

    svg.append("text")
        .attr("transform","translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size","20px")
        .attr("font-family","sans-serif")
        .text("LineChart for years of car model and fuel efficiency in highways");

    const xScale = d3.scaleLinear().range([0,width]);
    const yScale = d3.scaleLinear().range([height,0]);

    const container_g = svg.append("g")
        .attr("transform","translate(100,100)");

    d3.csv("https://gist.githubusercontent.com/tlin41390/b7cb4fb2dd543b138a06bbcbd4ea5d17/raw/00edc0d802df72c51b35b5c3101b16ac28460ee8/cars.csv").then(data=>{
        xScale.domain([d3.min(data,function(d){ return d.Year}),d3.max(data,function(d){ return d.Year})]);
        yScale.domain([0,60])

        container_g.selctAll("line")
            .data(data)
            .enter().append("path")

    })
}
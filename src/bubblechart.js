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
        .attr("transform","translate(100,0")
        .attr("x",50)
        .attr("y",50)
        .attr("font-size","20px")
        .attr("font-family","sans-serif")
        .text("Bubble Chart for Car Dimension and Car HorsePower/Torque")

    const container_g = svg.append("g")
        .attr("transform",
            "translate(100,100)");
    let xScale = d3.scaleLinear().range([0,width]);
    let yScale = d3.scaleLinear().range([height,0]);
    let sizeScale = d3.scaleLinear().range([])

    d3.csv("https://gist.githubusercontent.com/tlin41390/b7cb4fb2dd543b138a06bbcbd4ea5d17/raw/7847dd9d3ffa34e24dc5144fae74185bcc55f372/cars.csv").then(data=>{

    })
}
main();
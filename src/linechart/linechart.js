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
        .text("LineChart for years for fuel efficiency by year release");


    const yScale = d3.scaleLinear().range([height,0]);

    const container_g = svg.append("g")
        .attr("transform","translate(100,100)");

    d3.csv("https://gist.githubusercontent.com/tlin41390/6733ca28a6f864be20d7bcfb4028d325/raw/9564327eb2892a01c335ee7e993b1c1ef607a3de/broadway_saigon.csv", function(d){ return {date:d3.timeParse("%m/%d/%y")(d.Date), value:d.Gross}}).then(data=>{
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date}))
            .range([0,width]);

        console.log(data);
        console.log(d3.extent(data,d=>d.date));

        yScale.domain([0,d3.max(data, d=>d.value)])

        container_g.append("g")
            .attr("transform","translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(d3.timeYear));


        container_g.append("g")
            .call(d3.axisLeft(yScale))

        container_g.append("path")
            .datum(data)
            .attr("fill","none")
            .attr("stroke","blue")
            .attr("stroke-width",1.5)
            .attr("d",d3.line()
                .x(d => xScale(d.date))
                .y(d => yScale(d.value)));

    })
}
main();
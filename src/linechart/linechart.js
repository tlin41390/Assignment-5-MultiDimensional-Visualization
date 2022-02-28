function main(){
    const canvasWidth = 700;
    const canvasHeight = 700;
    const margin = 200;

    const svg = d3.select("body").append("svg")
        .attr("width", canvasWidth)
        .attr("height", canvasHeight)

    const width = svg.attr("width") - margin;
    const height = svg.attr("height") - margin;

    //append the text to the visual
    svg.append("text")
        .attr("transform","translate(100,0)")
        .attr("x", 50)
        .attr("y", 50)
        .attr("font-size","20px")
        .attr("font-family","sans-serif")
        .text("LineChart for Total Sales on Miss Saigon");


    const yScale = d3.scaleLinear().range([height,0]);

    const container_g = svg.append("g")
        .attr("transform","translate(100,100)");

    //convert the string to time format
    d3.csv("https://gist.githubusercontent.com/tlin41390/6733ca28a6f864be20d7bcfb4028d325/raw/9564327eb2892a01c335ee7e993b1c1ef607a3de/broadway_saigon.csv", function(d){ return {date:d3.timeParse("%m/%d/%y")(d.Date), value:d.Gross}}).then(data=>{
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date}))
            .range([0,width]);

        yScale.domain([0,d3.max(data, d=>d.value)])

        //append time as the x axis
        container_g.append("g")
            .attr("transform","translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(d3.timeYear))
            .append("text")
            .attr("y",height - 450)
            .attr("x", width-250)
            .attr("font-size","30px")
            .attr("stroke","black")
            .text("Year")

        //append to the y axis with the text
        container_g.append("g")
            .call(d3.axisLeft(yScale).tickFormat(function(d){return d/1000 + "K"}))
            .append("text")
            .attr("font-size","25px")
            .attr("transform","rotate(-90)")
            .attr("y",40)
            .attr("x",-100)
            .attr("dy","-4.1em")
            .attr("stroke","black")
            .text("Earnings for the Show");



        //create the line for the visual
        container_g.append("path")
            .datum(data)
            .attr("fill","none")
            .attr("stroke","blue")
            .attr("stroke-width",1.5)
            //use the built in d3 line function to create the line for the visual
            .attr("d",d3.line()
                .x(d => xScale(d.date))
                .y(d => yScale(d.value)));

    })
}
main();
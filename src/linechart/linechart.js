function main(){
    //credits to
    /* Alark Joshi's Skeletion Code
    /* https://www.d3-graph-gallery.com/graph/line_basic.html
    */
    const canvasWidth = 800;
    const canvasHeight = 800;
    const margin = 400;

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
        .text("LineChart for Shows in 1991-1994");


    const yScale = d3.scaleLinear().range([height,0]);

    const container_g = svg.append("g")
        .attr("transform","translate(100,100)");

    //convert the string to time format
    d3.csv("https://gist.githubusercontent.com/tlin41390/e7aebdfef38808e0d362143ce7a8b8ce/raw/24a3ab225e4ee1208bbe669e1c7af97ef340e98e/broadway.csv", function(d){ return {date:d3.timeParse("%m/%d/%y")(d.Date), value:d.Gross, name:d.Name}}).then(data=>{
        const xScale = d3.scaleTime()
            .domain(d3.extent(data, function(d) { return d.date}))
            .range([0,width]);

        yScale.domain([0,d3.max(data, d=>d.value)])

        let sumstat = d3.group(data,d=>d.name)
        console.log(sumstat);

        //append time as the x axis
        container_g.append("g")
            .attr("transform","translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(d3.timeYear))
            .append("text")
            .attr("y",height - 350)
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
            .attr("x",-80)
            .attr("dy","-4.1em")
            .attr("stroke","black")
            .text("Earnings for the Show");

        //color scale for the different plays that are being represented.
        const color = d3.scaleOrdinal()
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#1e90ff'])


        //create the line for the visual
        container_g.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill","none")
            .attr("stroke",function(d){ return color(d[0])})
            .attr("stroke-width",1.5)
            //use the built in d3 line function to create the line for the visual
            .attr("d",function(d){
                return d3.line()
                    .x(d => xScale(d.date))
                    .y(d => yScale(+d.value))
                    (d[1])
            })
        container_g.selectAll("legend")
            .data(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#1e90ff'])
            .enter().append("circle")
            .attr("class","circle")
            .attr("cx",25)
            .attr("cy",function(d,i){return 490 + i*25})
            .attr("r",10)
            .style("fill",function(d){ return d})

        container_g.selectAll("labels")
            .data(["Miss Saigon","Broken Glass","The Sisters Rosenweig","Beauty And The Beast","A Streetcar Named Desire 92","A Little More Magic"])
            .enter()
            .append("text")
            .attr("font-family","sans-serif")
            .attr("x",40)
            .attr("y",function(d,i){return 500 + i*25})
            .text(function(d){return d});
    })
}
main();
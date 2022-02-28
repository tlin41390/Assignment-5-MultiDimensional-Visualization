function main(){


    d3.csv("https://gist.githubusercontent.com/tlin41390/fb87e1c24725209974967748bca74c95/raw/8d51671e7790386b27755fe9ea54f7111e483d52/broadway(scatterplot_matrix).csv").then(data => {
        const size = 250;
        const padding = 50;

        let domainAttendance = {};
        const columns = data.columns.filter(d => d!=="Type");
        const colSize = columns.size;
        console.log(columns);


        const svg =  d3.select("body").append("svg")
            .attr("width", size * columns.length + padding)
            .attr("height", size * columns.length + padding)
            .append("g")
            .attr("transform", "translate(" + padding + "," + padding / 2 + ")");

        columns.forEach(function(column){
           domainAttendance[column] = d3.extent(data,function(d){return +d[column]});
        });

        const xScale = d3.scaleLinear()
            .range([padding/2, size - padding/2])

        const yScale = d3.scaleLinear()
            .range([size- padding/2,padding / 2])

        const color = d3.scaleOrdinal(d3.schemeCategory10);


        svg.selectAll(".x.axis")
            .data(columns)
            .enter().append("g")
            .attr("class","x axis")
            .attr("transform",function(d, i){return "translate(" + (columns.length-i-1) * size + ",0)"; })
            .each(function(d,i){ xScale.domain( domainAttendance[d]);if(columns[i]=="Gross"){
                d3.select(this).call(d3.axisBottom(xScale).tickFormat(function(d){ return d/1000 + "K"}).ticks(8).tickSize(size* columns.length))
            }else{
                console.log(columns[i]);
                d3.select(this).call(d3.axisBottom(xScale).ticks(5).tickSize(size* columns.length))}
            })

        svg.selectAll(".y.axis")
            .data(columns)
            .enter().append("g")
            .attr("class","y axis")
            .attr("transform", function(d, i) { return "translate(0, " + i * size + ")"})
            .each(function(d,i){ yScale.domain( domainAttendance[d]);if(columns[i]=="Gross"){
                d3.select(this).call(d3.axisLeft(yScale).tickFormat(function(d){ return d/1000 + "K"}).ticks(8).tickSize(-size* columns.length))
            }else{
                d3.select(this).call(d3.axisLeft(yScale).ticks(5).tickSize(-size* columns.length))}
            })

        let createCells = function(a, b) {
            let crossData = [];
            for (let i = 0; i < a.length;i++) {
                for (let j = 0; j < b.length;j++) {
                    crossData.push({x: a[i], i: i, y: b[j], j: j});
                }
            }
            return crossData;
        }

        let plot = function(p) {
            xScale.domain(domainAttendance[p.x]);
            yScale.domain(domainAttendance[p.y]);

            d3.select(this)
                .append("rect")
                .attr("class", "frame")
                .attr("x", padding / 2)
                .attr("y", padding / 2)
                .attr("width", size - padding)
                .attr("height", size - padding);

            d3.select(this)
                .selectAll("circle")
                .data(data)
                .enter().append("circle")
                .attr("cx", function(d) { return xScale(d[p.x]); })
                .attr("cy", function(d) { return yScale(d[p.y]); })
                .attr("r", 4)
                .style("fill", function(d) { return color(d.Type); });
        }
        const cell = svg.selectAll(".cell")
            .data(createCells(columns,columns))
            .enter().append("g")
            .attr("class", "cell")
            .attr("transform", function(d){ console.log(columns.length - d.i - 1 * size)
                return "translate(" + (columns.length - d.i - 1) * size + "," + d.j* size + ")"; })
            .each(plot);

        cell.filter(function(d){ return d.i === d.j;}).append("text")
            .attr("x",padding)
            .attr("y", padding)
            .attr("dy", ".71em")
            .text(function(d){ return d.x;});
    })
}
main();
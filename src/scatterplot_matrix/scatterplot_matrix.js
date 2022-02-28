function main(){
    //credits to:
    /* https://stackoverflow.com/questions/40468403/d3-convert-data-to-number
    /* https://bl.ocks.org/mbostock/3213173
    /* https://observablehq.com/@d3/brushable-scatterplot-matrix
    */
    d3.csv(
        'https://gist.githubusercontent.com/tlin41390/fb87e1c24725209974967748bca74c95/raw/8d51671e7790386b27755fe9ea54f7111e483d52/broadway(scatterplot_matrix).csv'
    ).then((data) => {
        const size = 250;
        const margin = 50;

        //filter the data so that only numbers are being calculated.
        let domainAttendance = {};
        const columns = data.columns.filter(
            (d) => d !== 'Type'
        );

        //append the graphic
        const svg = d3
            .select('body')
            .append('svg')
            .attr('width', size * columns.length + margin)
            .attr('height', size * columns.length + margin)
            .append('g')

        //get the range of the different columns.
        const container_g = svg.append('g')
            .attr("transform",'translate(' + margin + ',' + margin / 2 + ')');

        //convert the string columns to numbers
        columns.forEach(function (column) {
            domainAttendance[column] = d3.extent(
                data,
                function (d) {
                    return +d[column];
                }
            );
        });

        //set the x and y scales.
        const xScale = d3
            .scaleLinear()
            .range([margin / 2, size - margin / 2]);

        const yScale = d3
            .scaleLinear()
            .range([size - margin / 2, margin / 2]);

        //set the color scale.
        const color = d3.scaleOrdinal(d3.schemeCategory10);

        //set the x ticks of the graph
        container_g
            .selectAll('x.axis')
            .data(columns)
            .enter()
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', function (d, i) {
                return (
                    'translate(' +
                    (columns.length - i - 1) * size +
                    ',0)'
                );
            })
            .each(function (d, i) {
                xScale.domain(domainAttendance[d]);
                if (columns[i] == 'Gross') {
                    d3.select(this).call(
                        d3
                            .axisBottom(xScale)
                            .tickFormat(function (d) {
                                return d / 1000 + 'K';
                            })
                            .ticks(8)
                            .tickSize(size * columns.length)
                    );
                } else {
                    console.log(columns[i]);
                    d3.select(this).call(
                        d3
                            .axisBottom(xScale)
                            .ticks(5)
                            .tickSize(size * columns.length)
                    );
                }
            });

        //set the y axis of the graph
        container_g
            .selectAll('.y.axis')
            .data(columns)
            .enter()
            .append('g')
            .attr('class', 'y axis')
            .attr('transform', function (d, i) {
                return 'translate(0, ' + i * size + ')';
            })
            .each(function (d, i) {
                yScale.domain(domainAttendance[d]);
                if (columns[i] == 'Gross') {
                    d3.select(this).call(
                        d3
                            .axisLeft(yScale)
                            .tickFormat(function (d) {
                                return d / 1000 + 'K';
                            })
                            .ticks(8)
                            .tickSize(-size * columns.length)
                    );
                } else {
                    d3.select(this).call(
                        d3
                            .axisLeft(yScale)
                            .ticks(5)
                            .tickSize(-size * columns.length)
                    );
                }
            });

        //create the different cells by getting the different 	 dimmensions of the data for each matrix.
        let createCells = function (a, b) {
            let crossData = [];
            for (let i = 0; i < a.length; i++) {
                for (let j = 0; j < b.length; j++) {
                    crossData.push({
                        x: a[i],
                        i: i,
                        y: b[j],
                        j: j,
                    });
                }
            }
            return crossData;
        };

        //function that will plot the points for each matrix
        let plot = function (p) {
            xScale.domain(domainAttendance[p.x]);
            yScale.domain(domainAttendance[p.y]);

            //create the frame of the cell box
            d3.select(this)
                .append('rect')
                .attr('class', 'frame')
                .attr('x', margin / 2)
                .attr('y', margin / 2)
                .attr('width', size - margin)
                .attr('height', size - margin);

            //generate the plots of the graph
            d3.select(this)
                .selectAll('circle')
                .data(data)
                .enter()
                .append('circle')
                .attr('cx', function (d) {
                    return xScale(d[p.x]);
                })
                .attr('cy', function (d) {
                    return yScale(d[p.y]);
                })
                .attr('r', 4)
                .style('fill', function (d) {
                    return color(d.Type);
                });
        };
        //append the cells and the plots to the graph
        const cell = container_g
            .selectAll('.cell')
            .data(createCells(columns, columns))
            .enter()
            .append('g')
            .attr('class', 'cell')
            .attr('transform', function (d) {
                console.log(columns.length - d.i - 1 * size);
                return (
                    'translate(' +
                    (columns.length - d.i - 1) * size +
                    ',' +
                    d.j * size +
                    ')'
                );
            })
            .each(plot);

        //append the text to the graph
        cell
            .filter(function (d) {
                return d.i === d.j;
            })
            .append('text')
            .attr('x', margin)
            .attr('y', margin)
            .attr('dy', '.71em')
            .text(function (d) {
                return d.x;
            });
    });
}
main();
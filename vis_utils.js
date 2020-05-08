
function get_color(i) {

	if (i == 0) {
 		return "#000";
	} else if (i == 1) {
 		return "#0074D9";
	} else if (i == 2) {
 		return "#FF4136";
	} else if (i == 3) {
 		return "#2ECC40";
	} else if (i == 4) {
 		return "#FFDC00";
	} else if (i == 5) {
 		return "#AAAAAA";
	} else if (i == 6) {
 		return "#F012BE";
	} else if (i == 7) {
 		return "#FF851B";
	} else if (i == 8) {
 		return "#7FDBFF";
	} else if (i == 9) {
 		return "#870C25";
	}
}

function draw_grid(svg, width, height, image_width, image_height, step) {

	svg.append('rect')
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", image_width)
		.attr("height", image_height)
    	.attr("stroke", 'white')
    	.attr("stroke-width", 2)
        .attr('fill', 'none')
        .attr("shape-rendering", 'crispEdges');

	for (let i = 1; i < height; i++) {
    	svg.append('line')
    		.attr("x1", 0)
    		.attr("y1", i*step)
    		.attr("x2", image_width)
    		.attr("y2", i*step)
        	.attr("stroke", 'white')
        	.attr("stroke-width", 1)
            .attr("shape-rendering", 'crispEdges');
    }
	for (let i = 1; i < width; i++) {
    	svg.append('line')
    		.attr("x1", i*step)
    		.attr("y1", 0)
    		.attr("x2", i*step)
    		.attr("y2", image_height)
        	.attr("stroke", 'white')
        	.attr("stroke-width", 1)
            .attr("shape-rendering", 'crispEdges');
    }
}

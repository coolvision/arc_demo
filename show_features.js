
function feature_color(type) {
    if (type == "corner") {
        return "#357EDD"
    } else if (type == "point") {
        return "#E7040F"
    } else if (type == "endpoint") {
        return "#FFB700"
    } else if (type == "junction") {
        return "#19A974"
    } else if (type == "endpoint2") {
        return "#FFA3D7"
    } else if (type == "line") {
        return "#9EEBCF"
    }

    return "#000000"
}

function show_features(canvas, data, features, image_size = 50) {

    if (!data) return;

	let height = data.length;
	let width = data[0].length;

	let image_height = image_size;
	let image_width = Math.min(150, image_height * (width/height));
    image_height = image_width * (height/width);
    let step = Math.round(image_width / width);

    image_width = step * width;
    image_height = step * height;

    let svg = d3.select(canvas[0])
        .append("svg")
        .attr("width", image_width)
        .attr("height", image_height);
    svg.attr("class", "cl fl mb2")

    canvas.css("width", image_width);
    canvas.css("height", image_height*2 + 8);

    let r = Math.max(3, step/5);
    for (let f in features) {
    	svg.append('circle')
    		.attr("cx", features[f].j*step + step/2)
    		.attr("cy", features[f].i*step + step/2)
    		.attr("r", r)
    		.attr('fill', feature_color(features[f].type))
            .attr("shape-rendering", 'crispEdges');
    }

    draw_grid(svg, width, height, image_width, image_height, step);
}

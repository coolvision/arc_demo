var view_mode = "objects";

function load_problem(id) {

	preprocess(id, data[id]);

	$(".example_container").remove();
    $(".tiles_text").remove();

	for (let index in data[id].train) {
        show_example(id, index, data[id].train[index], "train");
	}

	for (let index in data[id].test) {
        show_example(id, index, data[id].test[index], "test");
	}
}

function show_example(id, index, image, set) {

	let jq_example_container = $("#example_container").clone().prop('id', "example_container_" + id + "_" + set + "_" + index);
	$("#two").append(jq_example_container);
	jq_example_container.show();

	jq_example_container.addClass("example_container");

    jq_example_container.prepend("<h2 class='cl fl mt4'>" + set + " example #" + index + "</h2>");

    let jq_input = jq_example_container.find(".input_image");
    let jq_output = jq_example_container.find(".output_image");
    let jq_result = jq_example_container.find(".result_image");

	show(jq_input, image.input);
	show(jq_output, image.output);
    if (image.hasOwnProperty("result")) {
		show(jq_result, image.result);
    }

    jq_input = jq_example_container.find(".input_objects");
    jq_output = jq_example_container.find(".output_objects");
    jq_result = jq_example_container.find(".result_objects");

    show_objects(image, "input", jq_input);
    show_objects(image, "output", jq_output);

    jq_description = jq_example_container.find(".output_description");
    let p = $('<p class=\"editable_code\">');
    p.text(image.program_description);
    jq_description.append(p);


    jq_input = jq_example_container.find(".input_features");
    jq_output = jq_example_container.find(".output_features");

    if (image.hasOwnProperty("input_features")) {
        show_features(jq_input, image.input, image.input_features);
    }
    if (image.hasOwnProperty("input_features_color")) {
        show_features(jq_input, image.input, image.input_features_color);
    }
    if (image.hasOwnProperty("output_features")) {
        show_features(jq_output, image.output, image.output_features);
    }
    if (image.hasOwnProperty("output_features_color")) {
        show_features(jq_output, image.output, image.output_features_color);
    }
}

function show_objects(image, img, container) {

    if (image.hasOwnProperty(img + "_objects")) {

        let div_group = $("<div class='cl fl'>");
        for (let i in image[img + "_objects"]) {
            let obj = image[img + "_objects"][i];

            let div = $("<div class='cl fl inline-flex pb1'>");
            div.append($("<div class='pa1 f7'>"+i+"</div>"))
            let div2 = $("<div>");

            [obj.svgString, obj.image_width, obj.image_height] = show_object(div2, obj.grid);

            div.append(div2);
            div.append($("<div class='f7 ph1 editable_code'>"
                + "parent: " + JSON.stringify(obj.parents)  + "\n"
                + "children: " + JSON.stringify(obj.children)  + "\n"
                + "</div>"))
            div_group.append(div);
        }
        container.append(div_group);
    }
}

function show(canvas, data, image_size = 100) {

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

    canvas.css("width", image_width);
    canvas.css("height", image_height + 16);

    svg.attr("class", "cl fl")

	let grid = data;
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (grid[i][j] > 0) {
            	svg.append('rect')
            		.attr("x", j*step)
            		.attr("y", i*step)
            		.attr("width", step)
            		.attr("height", step)
            		.attr('fill', get_color(grid[i][j]))
	                .attr("shape-rendering", 'crispEdges');
			}
		}
	}

    draw_grid(svg, width, height, image_width, image_height, step);
}

function show_object(canvas, data, image_size = 25) {

    if (!data) return;

	let height = data.length;
	let width = data[0].length;

    if (width * height > 400) return;

	let image_height = image_size;
	let image_width = Math.min(150, image_height * (width/height));
    image_height = image_width * (height/width);
    let step = Math.min(22, Math.round(image_width / width));

    image_width = step * width;
    image_height = step * height;

    var sel = d3.create('svg');

    let svg = d3.create("svg")
        .attr("width", image_width)
        .attr("height", image_height)

    canvas.css("width", image_width);
    canvas.css("height", image_height);

	let grid = data;
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			if (grid[i][j] > 0) {
            	svg.append('rect')
            		.attr("x", j*step)
            		.attr("y", i*step)
            		.attr("width", step)
            		.attr("height", step)
            		.attr('fill', get_color(grid[i][j]))
	                .attr("shape-rendering", 'crispEdges');
			}
		}
	}

    draw_grid(svg, width, height, image_width, image_height, step);

    var svgString = new XMLSerializer().serializeToString(svg.node());
    let cv = $("<canvas>");
    cv.attr("width", image_width);
    cv.attr("height", image_height);
    var ctx = cv[0].getContext("2d");

    var DOMURL = self.URL || self.webkitURL || self;
    var img = new Image();
    var svg1 = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
    var url = DOMURL.createObjectURL(svg1);
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
    img.src = url;

    canvas.append(cv);

    return [svgString, image_width, image_height];
}

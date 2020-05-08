

function preprocess_example(t, img, obj) {

	t[obj] = [];

    let w = t[img][0].length;
    let h = t[img].length;
 	let new_object = {"area": w*h,
 		"min_x": 0, "min_y": 0,
		"max_x": w-1, "max_y": h-1,
		"type": "full_image",
		"tags": [],
 		"w": w, "h": h, "center_x": w/h, "center_y": h/2,
 		"grid": _.cloneDeep(t[img]), "valid": true};
 	t[obj].push(new_object);

	let objects = {};
	let labels = [];
	let min_area = 1;

	objects = {};
	labels = [];
	find_components(t[img], labels, objects, false, 4);
	if (_.keys(objects).length < 75) {
		for (let i in objects) {
			if (objects[i].area >= min_area) t[obj].push(objects[i]);
		}
	}

	objects = {};
	labels = [];
	find_components(t[img], labels, objects, true, 4);
	if (_.keys(objects).length < 75) {
		for (let i in objects) {
			if (objects[i].area >= min_area) t[obj].push(objects[i]);
		}
	}

	objects = {};
	labels = [];
	find_components(t[img], labels, objects, false);
	if (_.keys(objects).length < 75) {
		for (let i in objects) {
			if (objects[i].area >= min_area) t[obj].push(objects[i]);
		}
	}

	objects = {};
	labels = [];
	find_components(t[img], labels, objects, true);
	if (_.keys(objects).length < 75) {
		for (let i in objects) {
			if (objects[i].area >= min_area) t[obj].push(objects[i]);
		}
	}

	// objects = {};
	// labels = [];
	// find_components(t[img], labels, objects, true, 2, true);
	// if (_.keys(objects).length < 50) {
	// 	for (let i in objects) {
	// 		if (objects[i].area >= min_area) t[obj].push(objects[i]);
	// 	}
	// }

	t[obj] = filter_same_shapes(t[obj]);

	t[obj].sort(function(a, b) {
		return (a.area > b.area ? -1 : 1);
	});

	for (let i = 0; i < t[obj].length; i++) {
		t[obj][i].parents = [];
		t[obj][i].children = [];
	}
	// for each object, check all other objects if they include it
	// find the smallest one, set it as paren object
	find_nested_shapes(t[obj]);

	for (let i in t[obj]) {
		fill_tags(t[img], t[obj][i]);
	}

	for (let i in t[obj]) {
		t[obj][i].index = i;
	}

	if (img == "output") {

		let description = [];
		process_objects_hierarchy(0, t.output_objects, t.input_objects, description);

		for (let i in description) {
			console.log(JSON.stringify(description[i]));
		}

		_.reverse(description);

		t.description = description;

		let program_description = processArray(JSON.stringify(description));
		t.program_description = program_description;
		console.log(program_description);
	}

	t[img+"_features"] = [];
	find_features(t[img], t[img+"_features"], true);
	t[img+"_features_color"] = [];
	find_features(t[img], t[img+"_features_color"], false);
}

function process_objects_hierarchy(index, output_objects, input_objects, description) {

	let obj = output_objects[index];

	// check if it exists in the input
	let same_input_shape = false;
	let transformed_input_shape = false;
	let transform = "";
	let similar_input_shape = false;
	let input_i = -1;
	for (let j in input_objects) {
		let input = input_objects[j];
		let output = obj;
		input_i = j;

		// if it's same as input objects
		if (compare_grids(input.grid, output.grid)) {
			same_input_shape = true;
			break;
		} else if (compare_grids(input.grid, reflect_h_2d(output.grid))) {
			transformed_input_shape = true;
			transform = '\"reflect_h_2d\"';
			break;
		} else if (compare_grids(input.grid, reflect_v_2d(output.grid))) {
			transformed_input_shape = true;
			transform = '\"reflect_v_2d\"';
			break;
		} else if (compare_grids(input.grid, reflect_v_2d(reflect_h_2d(output.grid)))) {
			transformed_input_shape = true;
			transform = '\"reflect_vh_2d\"';
			break;
		}
	}

	let d = [];

	if (same_input_shape || transformed_input_shape) {
		d = ["let", "object_" + index];
		let expr = ["find_similar_input",
			'\"'+input_objects[input_i].color+'\"',
			input_objects[input_i].w,
			input_objects[input_i].h,
			input_objects[input_i].min_x,
			input_objects[input_i].min_y];
		if (transformed_input_shape) {
			expr.push(transform);
		}
		d.push(expr);
		description.push(d);
		return;
	}

	if (obj.children.length == 0) {
		if (!obj.complex) {
			d = ["let", "object_" + index, ["init", obj.color, obj.w, obj.h]];
		} else {
			d = ["let", "object_" + index, "?"];
		}
	} else {
		d = [];
		d.push(["let", "object_" + index, ["init", '\"blank\"', obj.w, obj.h]])
		for (let i in obj.children) {
			let idx = obj.children[i];
			d.push([".add", "object_" + index, "object_" + idx, output_objects[idx].min_x, output_objects[idx].min_y]);
		}
	}

	description.push(d);

	for (let i in obj.children) {
		process_objects_hierarchy(obj.children[i], output_objects, input_objects, description);
	}
}

function preprocess(id, data) {

	let got_tiles = true;

	data.program_text = "";
	data.programs = [];

	for (d in data.train) {
		data.train[d].result = init_grid(data.train[d].input);
		preprocess_example(data.train[d], "input", "input_objects");
		preprocess_example(data.train[d], "output", "output_objects");
	}

	for (d in data.test) {
		preprocess_example(data.test[d], "input", "input_objects");
		preprocess_example(data.test[d], "output", "output_objects");
	}

	return true;
}


function is_inside(object1, object2) {

	if (object2.min_x == object1.min_x && object2.min_y == object1.min_y &&
		object2.max_x == object1.max_x && object2.max_y == object1.max_y) {
		return false;
	}

	if (object2.min_x >= object1.min_x && object2.min_y >= object1.min_y &&
		object2.max_x <= object1.max_x && object2.max_y <= object1.max_y) {
		return true;
	}
	return false;
}

// are all duplicated
function intersecting(object1, object2) {

	for (let i = 0; i < object1.h; i++) {
		for (let j = 0; j < object1.w; j++) {
			// check if first object pixel corresponds to a pixel from the second object
			let i1 = object1.min_y + i;
			let j1 = object1.min_x + j;
			if (i1 >= object2.min_y && i1 <= object2.max_y &&
				j1 >= object2.min_x && j1 <= object2.max_x) {
				if (object1.grid[i][j] > 0 &&
					object1.grid[i][j] == object2.grid[i1-object2.min_y][j1-object2.min_x]) {
					return true;
				}
			}
		}
	}

	return false;
}

// are all duplicated
function check_if_redundant(img, object1, object2) {

	let grid = init_grid(img);
	paste_object(grid, object1.min_x, object1.min_y, object1.grid);
	paste_object(grid, object2.min_x, object2.min_y, object2.grid);

	let grid1 = init_grid(img);
	let grid2 = init_grid(img);
	paste_object(grid1, object1.min_x, object1.min_y, object1.grid);
	paste_object(grid2, object2.min_x, object2.min_y, object2.grid);

	let v1 = compare_grids(grid1, grid);
	let v2 = compare_grids(grid2, grid);

	// console.log("check_if_redundant", object1, object2, "grid", grid, "grid1", grid1, "grid2", grid2, v1, v2);

	if (!v1 && !v2) return false;

	return true;
}

function check_if_part_of(object1, object2) {

	for (let i = 0; i < object1.h; i++) {
		for (let j = 0; j < object1.w; j++) {
			// check if first object pixel corresponds to a pixel from the second object
			let i1 = object1.min_y + i;
			let j1 = object1.min_x + j;
			if (i1 >= object2.min_y && i1 <= object2.max_y &&
				j1 >= object2.min_x && j1 <= object2.max_x) {
				if (object1.grid[i][j] > 0 &&
					object1.grid[i][j] != object2.grid[i1-object2.min_y][j1-object2.min_x]) {
					// console.log("object differs", i, j, i1, j1);
					return false;
				}
			} else {
				// console.log("object outside", i, j, i1, j1);
				return false;
			}
		}
	}

	return true;
}

function find_nested_shapes(objects) {

	for (let i = objects.length-1; i >= 0; i--) {
		let parents = [];
		for (let j = objects.length-1; j >= 0; j--) {
			if (i != j) {
				if (check_if_part_of(objects[i], objects[j])) {
					if (objects[i].parents.length == 0) {
						objects[i].parents.push(j);
						objects[j].children.push(i);
					}
				}
			}
		}
	}
}

function compare_shapes(object1, object2) {

	if (!(object1.w == object2.w && object1.h == object2.h)) return 1;
	for (let i = 0; i < object1.h; i++) {
		for (let j = 0; j < object1.w; j++) {
			if (object1.grid[i][j] != object2.grid[i][j]) return 1;
		}
	}
	return -1;
}

function compare_color(object1, object2) {

	if (max_color_2d(object1.grid) == max_color_2d(object2.grid)) {
		return 0;
	}

	return 1;
}

function distance(object1, object2) {
	if (object1.center_x == object2.center_x &&
		object1.center_y == object2.center_y) return 0;

	return 1;
}

function compare_size(object1, object2) {
	if (object1.w == object2.w &&
		object1.h == object2.h) return 0.5;

	return 1;
}

function same_shape(object1, object2) {

	if (!(object1.w == object2.w && object1.h == object2.h)) return false;
	if (!(object1.min_x == object2.min_x && object1.min_y == object2.min_y)) return false;

	for (let i = 0; i < object1.h; i++) {
		for (let j = 0; j < object1.w; j++) {
			if (object1.grid[i][j] != object2.grid[i][j]) return false;
		}
	}

	return true;
}

function same_shape_inv(object1, object2) {

	if (!(object1.w == object2.w && object1.h == object2.h)) return false;
	for (let i = 0; i < object1.h; i++) {
		for (let j = 0; j < object1.w; j++) {
			if (object1.grid[i][j] != object2.grid[i][j]) return false;
		}
	}

	return true;
}

function filter_same_groups(input_groups) {

	for (let i in input_groups) {
		input_groups[i].valid = true;
	}
	for (let i in input_groups) {
		for (let j in input_groups) {
			if (i != j && input_groups[i].valid && input_groups[j].valid) {
				let d = _.difference(input_groups[i].indexes, input_groups[j].indexes);
				if (d.length == 0) {
					input_groups[j].valid = false;
					// console.log("filter out", JSON.stringify(input_groups[i].indexes), JSON.stringify(input_groups[j].indexes));
				}
			}
		}
	}

	let groups = [];
	for (let i in input_groups) {
		if (input_groups[i].valid) groups.push(input_groups[i]);
	}
	return groups;
}


function filter_same_shapes(input_objects) {

	// console.log("filterSameShapes", input_objects);
	for (let i = 0; i < input_objects.length; i++) {
		// console.log("check", i, input_objects[i]);
		if (!input_objects[i].valid) continue;
		for (let j = i+1; j < input_objects.length; j++) {
			// console.log("check", i, j, input_objects[j]);
			if (i != j && input_objects[j].valid) {
				if (same_shape(input_objects[i], input_objects[j])) {
					if (!_.isEqual(input_objects[i].tags, input_objects[j].tags)) {
						input_objects[i].tags = _.concat(input_objects[i].tags, input_objects[j].tags);
					}
					input_objects[j].valid = false;
				}
			}
		}
	}

	let objects = [];
	for (let i in input_objects) {
		if (input_objects[i].valid) objects.push(input_objects[i]);
	}
	return objects;
}

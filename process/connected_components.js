
function get_color_bounding_box(index, input) {

	let new_object = {"area": 0,
		"min_x": 100, "min_y": 100,
		"max_x": 0, "max_y": 0,
		"w": 0, "h": 0, "center_x": 0, "center_y": 0,
		"grid": [], "valid": true};

	if (!input.length > 0) return new_object;

    let w = input[0].length;
    let h = input.length;

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
			if (input[i][j] == index) {
				new_object.area++;
				if (i < new_object.min_y) new_object.min_y = i;
				if (i > new_object.max_y) new_object.max_y = i;
				if (j < new_object.min_x) new_object.min_x = j;
				if (j > new_object.max_x) new_object.max_x = j;
			}
		}
	}
	if (new_object.area <= 0) return new_object;

	new_object.w = new_object.max_x - new_object.min_x + 1;
	new_object.h = new_object.max_y - new_object.min_y + 1;
	new_object.center_x = (new_object.min_x + new_object.w/2)/w;
	new_object.center_y = (new_object.min_y + new_object.h/2)/h;

	new_object.grid = new Array(new_object.h);
	for (let i = 0; i < new_object.h; i++) {
		new_object.grid[i] = new Array(new_object.w);
		for (let j = 0; j < new_object.w; j++) {
			new_object.grid[i][j] = 0;
		}
	}

    for (let i = 0; i < new_object.h; i++) {
        for (let j = 0; j < new_object.w; j++) {
			if (input[i+new_object.min_y][j+new_object.min_x] == index) {
				new_object.grid[i][j] = input[i+new_object.min_y][j+new_object.min_x];
			}
		}
	}

	// new_object.types = ["color"];
	new_object.type = "color_group";
	new_object.tags = ["color_group"];

	return new_object;
}

function get_neighbor(input, labels, i, j, neighbors, n, v, l, compare_values, invert) {

    let w = input[0].length;
    let h = input.length;

	let i1 = i + neighbors[n][0];
	let j1 = j + neighbors[n][1];

	if (i1 < 0 || i1 >= h || j1 < 0 || j1 >= w) return 0;

	if (invert) {
		if (input[i][j] == input[i1][j1] && input[i][j] == 0) {
			v[n] = 1;
		}
	} else if (compare_values) {
		if (input[i][j] == input[i1][j1]) {
			v[n] = input[i1][j1];
		}
	} else {
		v[n] = input[i1][j1];
	}
	l[n] = labels[i1][j1];

	return v[n];
}

const N_LABELS = 256;
function find_components(input, labels, objects, compare_values = false, neighbors_n = 2, invert = false) {

	let parent = new Array(N_LABELS);
	parent.fill(0);
    let inc_label = 0;

    let w = input[0].length;
    let h = input.length;

    let curr_label = 0;
	// labels = clone_grid(input);
	labels = init_grid(input);

	let neighbors = [[0, -1], [-1, 0]];
	if (neighbors_n == 4) {
		neighbors.push([-1, -1]);
		neighbors.push([-1, 1]);
	}
	var v = new Array(neighbors_n);
	var l = new Array(neighbors_n);

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {

			if (invert) {
				if (input[i][j] != 0) continue;
			} else {
				if (input[i][j] <= 0) continue;
			}

            // if (labels[i][j] > 0) {
			// if (input[i][j] == 0) {
			v.fill(0);
			l.fill(0);
			let connected_n = 0;
			for (let n in neighbors) {
				connected_n += get_neighbor(input, labels, i, j, neighbors, n, v, l, compare_values, invert);
			}
			if (connected_n == 0) {
                if (inc_label < N_LABELS-1) {
                    inc_label++;
                }
                curr_label = inc_label;
			} else {

				let min_l = N_LABELS+1;
				let min_l_index = -1;
				for (let n in l) {
					if (v[n] > 0 && l[n] < min_l) {
						min_l = l[n];
						min_l_index = n;
					}
				}
				curr_label = min_l;

				for (let n in l) {
					if (v[n] > 0 && n != min_l_index) {
						union_labels(min_l, l[n], parent);
					}
				}
			}

            labels[i][j] = curr_label;
            // }
        }
    }

	// console.log("find_components labels", labels);

	// let labels2 = clone_grid(labels);
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            let v = labels[i][j];
			if (v == 0) continue;

            labels[i][j] = find_parent(v, parent);

			if (!objects.hasOwnProperty(labels[i][j])) {
				objects[labels[i][j]] = {"area": 0,
					"min_x": 100, "min_y": 100,
					"max_x": 0, "max_y": 0,
					"center_x": 0, "center_y": 0, "label": labels[i][j],
					"valid": true};
			}

			let obj = objects[labels[i][j]];

            obj.area++;

            obj.min_x = Math.min(obj.min_x, j);
            obj.max_x = Math.max(obj.max_x, j);

            obj.min_y = Math.min(obj.min_y, i);
            obj.max_y = Math.max(obj.max_y, i);

            obj.center_x += (j + 0.5);
            obj.center_y += (i + 0.5);
        }
    }

	// console.log("find_components labels2", labels);

    for (let v in objects) {

        objects[v].w = objects[v].max_x - objects[v].min_x + 1;
        objects[v].h = objects[v].max_y - objects[v].min_y + 1;

		objects[v].center_x = (objects[v].min_x + objects[v].w/2)/w;
		objects[v].center_y = (objects[v].min_y + objects[v].h/2)/h;

		// make a grid for this object
		// allocate and copy data from the input image

	    let width  = objects[v].w;
	    let height = objects[v].h;
		let grid = new Array(height);
		for (let i = 0; i < height; i++) {
			grid[i] = new Array(width);
			for (let j = 0; j < width; j++) {
                if (labels[i + objects[v].min_y][j + objects[v].min_x] == objects[v].label) {
				    grid[i][j] = input[i + objects[v].min_y][j + objects[v].min_x];
                } else {
					if (invert) {
						grid[i][j] = 10;
					} else {
						grid[i][j] = 0;
					}
				}
			}
		}
		// console.log("set the grid," grid);

		objects[v].grid = grid;

		if (invert) {
			objects[v].type = "inverted";
		} else if (neighbors_n == 2) {
			objects[v].type = "4_connected";
		} else {
			objects[v].type = "8_connected";
		}
		objects[v].tags = [objects[v].type];
    }

	// console.log("find_components objects", JSON.stringify(objects));
}

function union_labels(x, y, parent) {

    let j = find_parent(x, parent);
    let k = find_parent(y, parent);

    if (j != k) {
        parent[k] = j;
    }
}

function find_parent(x, parent) {

    let j = x;
    while (parent[j] != 0) {
        j = parent[j];
    }
    return j;
}

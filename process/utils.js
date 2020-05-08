function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function max_color_2d(input) {
	let m = colors_h(input);
    m[0] = 0;
	return _.indexOf(m, _.max(m));
}

function colors_h(input) {
	let m = new Array(10).fill(0, 0, 10);
    let width  = input[0].length;
    let height = input.length;
	for (let i = 0; i < height; i++) {
		for (let j = 0; j < width; j++) {
			m[input[i][j]]++;
		}
	}
    return m;
}

function colors_n(input) {
    let m = colors_h(input);
    let n = 0;
    for (let i = 0; i < m.length; i++) {
        if (m[i] > 0) n++;
    }
    return n;
}

function colors_n_no_bg(input) {
    let m = colors_h(input);
    let n = 0;
    for (let i = 1; i < m.length; i++) {
        if (m[i] > 0) n++;
    }
    return n;
}

function shape_size(v, w, h) {
	let grid = new Array(h);
	for (let i = 0; i < h; i++) {
		grid[i] = new Array(w);
		for (let j = 0; j < w; j++) {
			grid[i][j] = v;
		}
	}
	return grid;
}

function paste_object(result, out_x, out_y, out_grid, inverted = false) {

    // console.log("paste_object", result, out_x, out_y, out_grid);

	if (!Array.isArray(out_grid)) return;

    let height = result.length;
    if (!height) return;
    let width  = result[0].length;

    let h = out_grid.length;
    if (!h) return;
    let w = out_grid[0].length;

	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
            if (i + out_y >= 0 && i + out_y < height &&
                j + out_x >= 0 && j + out_x < width) {
                if (inverted) {
                    if (out_grid[i][j] < 10) {
                        result[i + out_y][j + out_x] = out_grid[i][j];
                    }
                } else {
                    if (out_grid[i][j] > 0 && out_grid[i][j] < 10) {
                        result[i + out_y][j + out_x] = out_grid[i][j];
                    }
                }
            }
		}
	}

    // console.log("paste_object2", JSON.stringify(result));
}

function init_grid(input, v = 0) {

    let width  = input[0].length;
    let height = input.length;

	let grid = new Array(height);
	for (let i = 0; i < height; i++) {
		grid[i] = new Array(width);
		for (let j = 0; j < width; j++) {
			grid[i][j] = v;
		}
	}
	return grid;
}

function init_grid_size(width, height, v = 0) {

    // let width  = input[0].length;
    // let height = input.length;

	let grid = new Array(height);
	for (let i = 0; i < height; i++) {
		grid[i] = new Array(width);
		for (let j = 0; j < width; j++) {
			grid[i][j] = v;
		}
	}
	return grid;
}

function compare_grids(input, output, compare_color = true) {

    let w1  = input[0].length;
    let h1 = input.length;

    let w2  = output[0].length;
    let h2 = output.length;

	if (!(w1 == w2 && h1 == h2)) return false;
	for (let i = 0; i < h1; i++) {
		for (let j = 0; j < w1; j++) {
			if (compare_color) {
				if (input[i][j] != output[i][j]) return false;
			} else {
				if (input[i][j] > 0 && output[i][j] == 0) return false;
				if (input[i][j] == 0 && output[i][j] > 0) return false;
			}
		}
	}
	return true;
}

function clone_grid(input) {

    let width  = input[0].length;
    let height = input.length;

	let grid = new Array(height);
	for (let i = 0; i < height; i++) {
		grid[i] = new Array(width);
		for (let j = 0; j < width; j++) {
			grid[i][j] = input[i][j];
		}
	}
	return grid;
}

function _copy_grid(input, output) {
    let width  = input[0].length;
    let height = input.length;
	for (let i = 0; i < height; i++) {
		output[i] = new Array(width);
		for (let j = 0; j < width; j++) {
			output[i][j] = input[i][j];
		}
	}
}

function invert_2d(input) {
	let output = init_grid(input);
	let w = input[0].length;
	let h = input.length;
    let c = max_color_2d(input);
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
            if (input[i][j] == 0) {
                output[i][j] = c;
            } else {
                output[i][j] = 0;
            }
		}
	}
	return output;
}

function replace_color_2d(input, c1, c2) {
	let w = input[0].length;
	let h = input.length;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
            if (input[i][j] == c1) input[i][j] = c2;
		}
	}
}

function reflect_h_2d(input) {
	let output = init_grid(input);
	let w = input[0].length;
	let h = input.length;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			output[i][j] = input[i][w-j-1];
		}
	}
	return output;
}

function _reflect_h_2d(input, output) {
	new_output = init_grid(input);
	let w = input[0].length;
	let h = input.length;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			new_output[i][j] = input[i][w-j-1];
		}
	}
    _copy_grid(new_output, output);
}

function _reflect_v_2d(input, output) {
    new_output = init_grid(input);
	let w = input[0].length;
	let h = input.length;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			new_output[i][j] = input[h-i-1][j];
		}
	}
    _copy_grid(new_output, output);
}

function reflect_v_2d(input) {
	let output = init_grid(input);
	let w = input[0].length;
	let h = input.length;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			output[i][j] = input[h-i-1][j];
		}
	}
	return output;
}

function set_color_2d(input, v) {
	let output = init_grid(input);
	let w = input[0].length;
	let h = input.length;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
            if (input[i][j] > 0) {
			    output[i][j] = v;
            }
		}
	}
	return output;
}

function fill_color_2d(input, v) {
	let output = init_grid(input);
	let w = input[0].length;
	let h = input.length;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			output[i][j] = v;
		}
	}
	return output;
}

function resize_2d(input, s) {
	let w = input[0].length;
	let h = input.length;
    let output = init_grid_size(w*s, h*s);
	for (let i = 0; i < h*s; i++) {
		for (let j = 0; j < w*s; j++) {
            let i1 = Math.floor(i/s);
            let j1 = Math.floor(j/s);
            // console.log(i, j, i1, j1);
            output[i][j] = input[i1][j1];
		}
	}
	return output;
}

function add_2d(input1, input2) {
	let w = Math.max(input1[0].length, input2[0].length);
	let h = Math.max(input1.length, input2.length);
	let output = init_grid_size(w, h);
	for (let i = 0; i < input1.length; i++) {
		for (let j = 0; j < input1[0].length; j++) {
			output[i][j] = input1[i][j];
		}
	}
	for (let i = 0; i < input2.length; i++) {
		for (let j = 0; j < input2[0].length; j++) {
			output[i][j] += input2[i][j];
		}
	}
	return output;
}

function transpose_2d(input) {
	let w1 = Math.max(input[0].length, input.length);
    let output = init_grid_size(w1, w1);
	let w = input[0].length;
	let h = input.length;
	for (let i = 0; i < w1; i++) {
		for (let j = 0; j < w1; j++) {
            if (i < w && j < h) output[i][j] = input[j][i];
		}
	}
	return output;
}

function fill_n_cells(input, n, color, start = 0) {
    let w = input[0].length;
    let h = input.length;
    let i = 0;
	for (i = start; i < h; i++) {
		for (let j = 0; j < w; j++) {
			input[i][j] = color;
            if (--n == 0) return i+1;
		}
	}
    return i+1;
}

function reflect_h(w, input) {
	let output = new Array(input.length).fill(0, 0, input.length);
	let h = input.length/w;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			output[i*w+j] = input[i*w+(w-j-1)];
		}
	}
	return output;
}

function reflect_v(w, input) {
	let utput = new Array(input.length).fill(0, 0, input.length);
	let h = input.length/w;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			output[i*w+j] = input[(h-i-1)*w+j];
		}
	}
	return output;
}
function transpose(w, input) {
	output = new Array(input.length).fill(0, 0, input.length);
	let h = input.length/w;
	for (let i = 0; i < h; i++) {
		for (let j = 0; j < w; j++) {
			output[i*w+j] = input[j*w+i];
		}
	}
	return output;
}

function max(input) {
	let m = 0;
	for (let i = 0; i < input.length; i++) {
		if (input[i] > m) m = input[i];
	}
	return m;
}

function min(input) {
	let m = 1000;
	for (let i = 0; i < input.length; i++) {
		if (input[i] < m) m = input[i];
	}
	return m;
}

function max_number(input) {
	let m = new Array(10).fill(0, 0, 10);
	for (let i = 0; i < input.length; i++) {
		m[input[i]]++;
	}
	return max(m);
}

function min_number(input) {
	let m = new Array(10).fill(0, 0, 10);
	for (let i = 0; i < input.length; i++) {
		m[input[i]]++;
	}
	return min(m);
}

function invert(input) {
	output = new Array(input.length).fill(0, 0, input.length);
	let n1 = max(input);
	for (let i = 0; i < input.length; i++) {
	    if (!input[i]) {
	        output[i] = n1;
	    }
	}
	return output;
}

function id_to_color(i) {

	if (i == 0) {
 		return "blank";
	} else if (i == 1) {
 		return "blue";
	} else if (i == 2) {
 		return "red";
	} else if (i == 3) {
 		return "green";
	} else if (i == 4) {
 		return "yellow";
	} else if (i == 5) {
 		return "gray";
	} else if (i == 6) {
 		return "magenta";
	} else if (i == 7) {
 		return "orange";
	} else if (i == 8) {
 		return "light blue";
	} else if (i == 9) {
 		return "brown";
	} else {
		return "black";
	}
}


function find_features(input, features, all_colors) {

    let w = input[0].length;
    let h = input.length;

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {

	        let n = 1;
        	let elem = [[-1,  0, -1],
        				[ 0,  1,  1],
        				[-1,  1, -1]];
            hit_or_miss_rotated(input, i, j, w, h, elem, n, features, "corner", all_colors);

	        n = 1;
        	elem = [[ 0,  0,  0],
        			[ 0,  1,  0],
        			[ 1,  0,  1]];
            hit_or_miss_rotated_sv(input, i, j, w, h, elem, n, features, "corner", all_colors);

	        n = 1;
        	elem = [[ 0,  0,  0],
        			[ 0,  1,  0],
        			[ 0,  0,  0]];
			if (hit_or_miss(input, i, j, w, h, elem, n, all_colors)) {
				features.push({"i": i, "j": j, "type": "point"});
			}

	        n = 1;
        	elem = [[-1, 0, -1],
        			[ 0, 1,  0],
        			[-1, 1, -1]];
            hit_or_miss_rotated_sv(input, i, j, w, h, elem, n, features, "endpoint", all_colors);

	        n = 1;
        	elem = [[ 0, 0,  0],
        			[ 0, 1,  0],
        			[ 0, 0,  1]];
            hit_or_miss_rotated(input, i, j, w, h, elem, n, features, "endpoint2", all_colors);

	        n = 1;
        	elem = [[ 0, 1,  0],
        			[ 1, 1,  1],
        			[-1,-1, -1]];
            hit_or_miss_rotated_sv(input, i, j, w, h, elem, n, features, "junction", all_colors);

	        n = 1;
        	elem = [[ 1, 0,  1],
        			[ 0, 1,  0],
        			[-1, 0,  1]];
            hit_or_miss_rotated_sv(input, i, j, w, h, elem, n, features, "junction", all_colors);

	        n = 1;
        	elem = [[-1, 0, -1],
        			[ 1, 1,  1],
        			[-1, 0, -1]];
            hit_or_miss_rotated_sv(input, i, j, w, h, elem, n, features, "line", all_colors);

	        n = 1;
        	elem = [[ 0, 0,  1],
        			[ 0, 1,  0],
        			[ 1, 0,  0]];
            hit_or_miss_rotated(input, i, j, w, h, elem, n, features, "line", all_colors);

        }
    }
}

function hit_or_miss_rotated(input, i, j, w, h, elem, n, features, type, all_colors) {

	if (hit_or_miss(input, i, j, w, h, elem, n, all_colors)) {
		features.push({"i": i, "j": j, "type": type});
	}
	if (hit_or_miss(input, i, j, w, h, reflect_h_2d(elem), n, all_colors)) {
		features.push({"i": i, "j": j, "type": type});
	}
	if (hit_or_miss(input, i, j, w, h, reflect_v_2d(elem), n, all_colors)) {
		features.push({"i": i, "j": j, "type": type});
	}
	if (hit_or_miss(input, i, j, w, h, reflect_v_2d(reflect_h_2d(elem)), n, all_colors)) {
		features.push({"i": i, "j": j, "type": type});
	}
}

function hit_or_miss_rotated_sv(input, i, j, w, h, elem, n, features, type, all_colors) {

	if (hit_or_miss(input, i, j, w, h, elem, n, all_colors)) {
		features.push({"i": i, "j": j, "type": type});
	}
	if (hit_or_miss(input, i, j, w, h, reflect_v_2d(elem), n, all_colors)) {
		features.push({"i": i, "j": j, "type": type});
	}
	if (hit_or_miss(input, i, j, w, h, transpose_2d(elem), n, all_colors)) {
		features.push({"i": i, "j": j, "type": type});
	}
	if (hit_or_miss(input, i, j, w, h, reflect_h_2d(transpose_2d(elem)), n, all_colors)) {
		features.push({"i": i, "j": j, "type": type});
	}
}

function hit_or_miss(input, i, j, w, h, elem, n, all_colors) {
	let found = true;
    let v0 = input[i][j];
	for (let i1 = 0; i1 <= 2; i1++) {
		for (let j1 = 0; j1 <= 2; j1++) {
			let vi = i-n+i1;
			let vj = j-n+j1;
			let v = 0;
			if (vi >= 0 && vi < h && vj >= 0 && vj < w) {
				v = input[vi][vj];
			}
            if (all_colors) {
                if (v > 0) v = 1;
            } else {
                if (v > 0 && v == v0) {
                    v = 1;
                } else {
                    v = 0;
                }
            }

			if (elem[i1][j1] >= 0 && elem[i1][j1] != v) {
				found = false;
				break;
			}
		}
		if (!found) break;
	}
	return found;
}

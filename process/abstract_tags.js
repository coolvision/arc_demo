
function fill_tags(image, obj) {

	let width = image[0].length;
    let height = image.length;

	let w = obj.grid[0].length;
    let h = obj.grid.length;

	if (!obj.hasOwnProperty("tags")) {
		obj.tags = [];
	}

	obj.complex = false;
    let m = colors_h(obj.grid);
	if (m[0] == 0) {
		if (w == h) {
			obj.tags.push("square");
		} else if (w == 1 && h > 1 || h == 1 && w > 1) {
			obj.tags.push("line");
		} else {
			obj.tags.push("rectangle");
		}
	} else if (w > 1 || h > 1) {
		obj.tags.push("complex");
		obj.complex = true;
	}
	if (w > h) {
		obj.tags.push("horizontal");
	} else if (w < h) {
		obj.tags.push("vertical");
	}

	obj.multicolor = false;
	obj.color = id_to_color(max_color_2d(obj.grid));
	obj.color_id = max_color_2d(obj.grid);//id_to_color(max_color_2d(obj.grid));
	if (colors_n_no_bg(obj.grid) > 1) {
		obj.tags.push("multicolor");
		obj.multicolor = true;
	} else {
		obj.tags.push("single-color");
	}

	let corner = false;
	let full_image = false;
	if (obj.min_x == 0 && obj.min_y == 0 && obj.max_x == width-1 && obj.max_y == height-1) {
		obj.tags.push("full image");
		corner = true;
		full_image = true;
	} else {
		if (obj.min_x == 0 && obj.min_y == 0) {
			corner = true;
			obj.tags.push("TL corner");
		}
		if (obj.max_x == width-1 && obj.min_y == 0) {
			corner = true;
			obj.tags.push("TR corner");
		}
		if (obj.max_x == width-1 && obj.max_y-1 == height-1) {
			corner = true;
			obj.tags.push("BR corner");
		}
		if (obj.min_x == 0 && obj.max_y == height-1) {
			corner = true;
			obj.tags.push("BL corner");
		}
	}

	if (!corner) {
		if (obj.min_x == 0) {
			obj.tags.push("L border");
		}
		if (obj.min_y == 0) {
			obj.tags.push("T border");
		}
		if (obj.max_x == width-1) {
			obj.tags.push("R border");
		}
		if (obj.max_y == height-1) {
			obj.tags.push("B border");
		}
	}

	if (!full_image) {
		if (Math.abs(obj.center_x - 0.5) < 0.1/width && Math.abs(obj.center_y - 0.5) < 0.1/height) {
			obj.tags.push("center");
		} else {
			if (Math.abs(obj.center_x - 0.5) < 0.1/width) {
				obj.tags.push("centered (H)");
			} else {
				if (obj.center_x < 0.5) {
					obj.tags.push("left");
				} else {
					obj.tags.push("right");
				}
			}
			if (Math.abs(obj.center_y - 0.5) < 0.1/height) {
				obj.tags.push("centered (V)");
			} else {
				if (obj.center_y < 0.5) {
					obj.tags.push("top");
				} else {
					obj.tags.push("bottom");
				}
			}
		}
	}

	let area = w*h;
	if (area < 10) {
		obj.tags.push("small");
	} else if (area < 30) {
		obj.tags.push("mid-size");
	} else {
		obj.tags.push("large");
	}
}

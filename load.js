
var current_id = "66e6c45b";
var data = {};
var files = [];

function load() {

	$("#example_container").hide();

	for (file in data2) {
		// console.log(file, data2[file].name);
		let d = data2[file].name;

		data[d] = data2[file].data;

		let div = $("<div>");
		div.attr("id", d);
		div.addClass("");

		let div1 = $("<div>" + d + "</div>");
		div1.addClass("id_button bb f5 pa1 dib pointer hover-blue");

		div.append(div1);

		div.click(function() {
			let id = $(this).attr("id");
			$(".id_button").removeClass("blue");
			$(this).find(".id_button").addClass("blue");
			current_id = id;
			load_problem(id);
		});

		$("#three").append(div);
	}

	current_id = data2[0].name;
	$("#"+current_id + " .id_button").addClass("blue");
	load_problem(current_id);;
}

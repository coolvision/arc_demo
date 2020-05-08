'use strict'

function typeToId(type) {
    if (types.hasOwnProperty(type)) {
        return types[type];
    }
    return type;
}

function indent(offset) {
	var string = "";
	for (let i = 0; i < offset; i++) string += "    ";
	return string;
}

function addExpression(obj, expressions, offset, inline = false, guard = true) {

	let string = "";
	let add_string1 = "";
	add_string1 += processArrayGenerateString(obj, expressions, offset+1, inline, guard);
	string += add_string1;
	add_string1 = add_string1.trim();
	return string;
}

function processArrayGenerateString(obj, expressions, offset, inline = false, guard = true) {

	var string = "";

	if (!Array.isArray(obj)) {
        if (obj == '~') {
            return "";
        }
        return obj;
    }
	if (obj.length < 1) return obj;

	if (typeof obj[0] == "number") {
		obj[0] = f[obj[0]][0];
	}

	if (Array.isArray(obj[0])) {

		for (var key in obj) {
			let add_string = "";
			add_string += processArrayGenerateString(obj[key], expressions, offset, inline, guard);
			string += add_string;
			expressions.push(add_string.trim() + "\n");
		}
	    return string;


    } else if (obj[0] == "block") {

        string += indent(offset) + "// block\n";
		for (let i = 1; i < obj.length; i++) {
			let add_string = "";
			add_string += processArrayGenerateString(obj[i], expressions, offset, inline, guard);
			string += add_string;
			expressions.push(add_string.trim() + "\n");
		}
	    return string;

    } else if (obj[0] == "") {

        return obj[1];

    } else if (obj[0] == "~") {

        return "";

	} else if (obj[0] == "for") {

		string += indent(offset); // indentation

        if (guard) {
    		string +=
                "for (let " + obj[1] + " = " + processArrayGenerateString(obj[2], expressions, offset, true) + ", j = 0; "
                            // + indent(offset+1) +
                            + obj[1] + " < " + processArrayGenerateString(obj[3], expressions, offset, true) + "; "
                            + obj[1] + " += " + processArrayGenerateString(obj[4], expressions, offset, true) + ") {\n";
            string += indent(offset+1) + "j++;\n"
            string += indent(offset+1) + "if (l) break;\n"
            string += indent(offset+1) + "if (j > 100) {console.log(\"*"+obj[1]+"\"); l = true; break};\n"
        } else {
    		string +=
                "for (let " + obj[1] + " = " + processArrayGenerateString(obj[2], expressions, offset, true) + "; "
                            + obj[1] + " < " + processArrayGenerateString(obj[3], expressions, offset, true) + "; "
                            + obj[1] + " += " + processArrayGenerateString(obj[4], expressions, offset, true) + ") {\n";
        }

		for (var key = 5; key < obj.length; key++) {
			let add_string = "";
			add_string += processArrayGenerateString(obj[key], expressions, offset+1, inline, guard);
			string += add_string;
		}

		string += indent(offset); // indentation
		string += "}";
		string += '\n';

	} else if (obj[0] == "break") {

        string += indent(offset) + "break;\n";

	} else if (obj[0] == "while") {

        if (guard) {
    		string += indent(offset) + "j=0;\n";
            string += indent(offset) + "while (" + processArrayGenerateString(obj[1], expressions, offset, true) + ") {\n";
            string += indent(offset+1) + "j++;\n"
            string += indent(offset+1) + "if (l) break;\n"
            string += indent(offset+1) + "if (j > 100) {console.log(\"*"+obj[1]+"\"); l = true; break};\n"
        } else {
            string += indent(offset) + "while (" + processArrayGenerateString(obj[1], expressions, offset, true) + ") {\n";
        }

		for (var key = 2; key < obj.length; key++) {
			let add_string = "";
			add_string += processArrayGenerateString(obj[key], expressions, offset+1, inline, guard);
			string += add_string;
		}

		string += indent(offset); // indentation
		string += "}";
		string += '\n';

	} else if (obj[0] == "if") {

		string += indent(offset); // indentation
		string += "if (";
		string += addExpression(obj[1], expressions, offset, true);
		string += ") {\n";
		string += addExpression(obj[2], expressions, offset, false, guard);
		string += indent(offset); // indentation

        if (obj.length > 3) {
    		string += "} else {\n";
    		string += addExpression(obj[3], expressions, offset, false, guard);
    		string += indent(offset); // indentation
    		string += "}";
    		string += '\n';
        } else {
    		string += "}";
    		string += '\n';
        }

	} else if (obj[0] == "function") {

		string += indent(offset); // indentation
		string += "function " + obj[1] + "(";
		for (var key = 0; key < obj[2].length; key++) {
			string += obj[2][key][0] + "=" + obj[2][key][1];
            if (key < obj[2].length-1) string += ", ";
		}
        string += ") {\n";

		for (var key = 3; key < obj.length; key++) {
			let add_string = "";
			add_string += processArrayGenerateString(obj[key], expressions, offset+1, inline, guard);
			string += add_string;
		}

		string += "}\n";

	} else if (obj[0].includes("~")) {

        string += indent(offset);
		string += obj[0] + "\n";
		for (var key = 1; key < obj.length; key++) {
			let add_string = "";
			add_string += processArrayGenerateString(obj[key], expressions, offset, inline, guard);
			string += add_string;
		}

	} else if (obj[0] == "index") {

        if (!inline) string += indent(offset);
        string += obj[1] + "[";
        string += processArrayGenerateString(obj[2], expressions, offset, true);
        string += "]";


	} else if (obj[0] == "set_index") {

        if (!inline) string += indent(offset);
        string += obj[1] + "[";
        string += processArrayGenerateString(obj[2], expressions, offset, true);
        string += "] = " + obj[3] + ";\n";

	} else if (obj[0] == "js") {

        string += obj[1];

	} else if (obj[0] == "//") {

        string += indent(offset) + "//" + obj[1] + "\n";

	} else {

		var binary = /\+|-|==|<|>|\*|\/|%|=|\+=|-=|\*=|\/=/;
		var unary = /\+{2}|-{2}/;

		if (!inline) string += indent(offset); // indentation

		if (obj[0].match(unary)) {

			// unary operator
			string += obj[1] + obj[0];

		} else if (obj[0].match(binary)) {

			// binary operator
			string += processArrayGenerateString(obj[1], expressions, offset, true);
			string += " " + obj[0] + " ";
			string += processArrayGenerateString(obj[2], expressions, offset, true);

		} else {

			var start_args = 2;
			var parentheses = true;

			if (obj[0].substring(0, 3) == "let" || obj[0].substring(0, 3) == "var") {
				if (obj.length == 2) {
					string += obj[0].substring(0, 3) + " " + obj[1];
					start_args = 2;
				} else {
					string += obj[0].substring(0, 3) + " " + obj[1] + " = ";
	                string += processArrayGenerateString(obj[2], expressions, offset, true);
					start_args = 3;
				}
				parentheses = false;
			} else if (obj[0][0] == ".") {
				if (obj[0][obj[0].length-1] == "_") {
					obj[0] = obj[0].substring(0, obj[0].length-1);
					string += processArrayGenerateString(obj[1], expressions, offset, true);
					string += obj[0];
					start_args = 2;
					parentheses = false;
				} else {
					string += processArrayGenerateString(obj[1], expressions, offset, true);
					string += obj[0];
				}
			} else {
                string += obj[0];
                start_args = 1;
            }

            if (obj[0] == "!") {
                parentheses = false;
            }

			var args_string = "";
			for (var key = start_args; key < obj.length; key++) {
				if (Array.isArray(obj[key])) {
					args_string += processArrayGenerateString(obj[key], expressions, offset, true);
				} else {
					args_string += obj[key];
				}
				if (key != obj.length - 1) args_string += ", ";
			}

			if (parentheses) {
				string += "(" + args_string + ")";
			} else {
				string += args_string;
			}
		}
		if (!inline) {
			string += ';';
			string += '\n';
		}
	}

	return string;
}

function processArray(script, expressions = [], guard = true, inline = false) {
	let obj = JSON.parse(script);
    var string = "";
    // console.log("processArray", guard);
	string += processArrayGenerateString(obj, expressions, 0, inline, guard);
    return string;
}

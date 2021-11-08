export class ArgParserNode {
	constructor(name, value = undefined) {
		this.name = name;
		this.value = value;
	}

	toString() {
		return `${this.name}${this.value ? "=" + this.value : ""}`;
	}
}

export class ArgParser {
	constructor(args, possible_args) {
		this.args = args;
		this.possible_args = possible_args;
		
		if (this.possible_args.indexOf("--help") == -1) {
			this.possible_args.push("--help");
		}

		this.nodes = [];
	}

	parse() {
		for (let arg of this.args) {
			if (arg.startsWith("-")) {
				if (arg.indexOf("=") != -1) {
					let split = arg.split("=");
					if (this.possible_args.indexOf(split[0]) != -1) {
						this.nodes.push(new ArgParserNode(split[0], split[1]));
					} else {
						throw new Error("Invalid argument: " + arg);
					}
				} else {
					if (this.possible_args.indexOf(arg) != -1) {
						this.nodes.push(new ArgParserNode(arg));
					} else {
						throw new Error("Invalid argument: " + arg);
					}
				}
			} else {
				throw new Error("Invalid argument: " + arg);
			}
		}

		if (this.is_option_set("--help")) {
			let str = "Possible arguments:\n";
			
			for (let arg of this.possible_args) {
				str += "> " + arg + "\n";
			}

			console.log(str);
			
			Deno.exit(0);
		}
	}

	consume_option(name, _default = undefined) {
		for (let node of this.nodes) {
			if (node.name == name) {
				this.nodes.splice(this.nodes.indexOf(node), 1);

				if (!node.value) {
					throw new Error("Missing value for argument: " + node.name);
				}
				
				return node.value;
			}
		}

		if (_default != undefined) {
			return _default;
		} else {
			throw new Error("Missing argument: " + name);
		}
	}

	is_option_set(name) {
		for (let node of this.nodes) {
			if (node.name == name) {
				return true;
			}
		}

		return false;
	}

	toString() {
		let str = "";
		for (let node of this.nodes) {
			str += node.toString() + "\n";
		}

		return str;
	}
}
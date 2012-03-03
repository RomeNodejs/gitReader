'use strict';
/*jslint node: true, white: true, maxerr: 50, indent: 2 */

var commit_parser = require('./parser/commit.js')
	,	blob_parser = require('./parser/blob.js')
	, tree_parser = require('./parser/tree.js')
	;

var objTypes = {
	"commit": commit_parser,
	"blob": blob_parser,
	"tree": tree_parser
};


var parse = function (data) {
	var obj, findNextChar, getChunck, getHeader, header,
		getData;
	obj = {};

	findNextChar = function (char, start) {
		var from = (start === undefined) ? 0 : start;

		if (from >= data.length) {
			return data.length;
		}

		while ((data[from] !== char.charCodeAt(0)) && (from < data.length)) {
			from += 1;
		}
		return from;
	};

	getChunck = function (start) {
		var from, to;
		from = (start === undefined) ? 0 : start;
		if (from >= data.length) {
			return null;
		}

		to = findNextChar('\0', from);
		return data.slice(from, to);
	};

	getHeader = function () {
		var header = getChunck(0),
			field = header.toString().split(" ");

		header = {
			type: field[0],
			length: field[1]
		};

		return header;
	};

	getData = function (type) {
		var body, from;
		from = findNextChar('\0', 0);
		body = objTypes[type].parse(data.slice(from + 1));
		return body;
	};

	header = getHeader();
	obj.type = header.type;
	obj.body = getData(header.type);
	return obj;
};

module.exports = { parse: parse };
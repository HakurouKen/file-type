var magic = require('./config.json');
var gb = require('./getBuffer');

function type(o) {
	return Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
}

function num2Buf(num) {
	num = type(num) === 'string' ? num : num.toString(16);
	var digit = num.replace(/^0x/g, "").split(""),
		arr = [];

	digit.length % 2 && digit.push("_");

	for (var i = 0, l = digit.length; i < l; i += 2) {
		if (digit[i + 1] !== "_") {
			arr.push(parseInt(digit[i] + digit[i + 1], 16));
		} else {
			arr.push(new RegExp('^' + digit[i], 'g'));
		}
	}

	return arr;
}

function fileType(buf) {

	function compare(header, position) {
		if (header.indexOf(',') > -1) {
			return header.split(',').filter(function(h) {
				return compare(h, position);
			}).length;
		}

		var headerArr = num2Buf(header.replace(/\s/g, ""));
		position = parseInt(position) || 0;

		return headerArr.every(function(ele, i) {
			if (type(ele) === 'number') {
				return buf[i + position] === ele;
			} else {
				return ele.test && ele.test(buf[i + position].toString(16));
			}
		});
	}

	var res = magic.filter(function(fileMagic, i) {
		var header = fileMagic.header;
		if (type(header) === 'string') {
			return compare(header, fileMagic.position);
		} else if (type(header) === 'object') {
			return compare(header.position, header.value);
		} else if (type(header) === 'array') {
			return header.every(function(h) {
				return compare(h.value, h.position);
			});
		}
	});

	if (res[0]) {
		return {
			ext: res[0].ext,
			mime: res[0].mime
		};
	}

	return null;
}

var ft = module.exports = {};

ft.getFileType = function(path, callback) {
	gb.readBuffer(path, 300, function(err, buf) {
		if (err) {
			callback(err);
		} else {
			callback(null, fileType(buf));
		}
	});
}

ft.getFileTypeSync = function(path) {
	var buf = gb.readBufferSync(path, 300);
	return fileType(buf);
}
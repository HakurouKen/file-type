var fs = require('fs');

var gb = module.exports = {};

gb.readBuffer = function (path, length, position, callback) {
	if( typeof position === 'function' ){
		callback = position;
		position = 0;
	}

	return fs.open(path, 'r', function(err, fd) {
		var buffer = new Buffer(length);

		if (err) {
			return callback(err);
		}

		fs.read(fd, buffer, 0, length, position, function (err, bytesRead, buf){
			if (err) {
				return callback(err);
			}

			fs.close(fd, function (err) {
				if (err) {
					return callback(err);
				}

				if (bytesRead < length){
					buf = buf.slice(0, bytesRead);
				}

				callback(null, buf);
			});
		});
	});
}

gb.readBufferSync = function (path, length, position) {
	position = position || 0;

	var buffer = new Buffer(length),
		fd = fs.openSync(path, 'r'),
		bytesRead = fs.readSync(fd, buffer, 0, length, position);

	fs.close(fd);

	if (bytesRead < length) {
		buffer = buffer.slice(0, bytesRead);
	}

	return buffer;
}
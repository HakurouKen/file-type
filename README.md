# file-type
> Detect the file type

Modified from project [sindresorhus/file-type](https://github.com/sindresorhus/file-type)

## Usage

#### Sync

```js
var ft = require('file-type');

ft.getFileTypeSync('test.png');
// => {ext: 'png', mime:'image/png'}

```

#### Async

```js
var ft = require('file-type');

ft.getFileType('test.png', function (err, type) {
	if (err) {
		callback(err);
	} else {
		callback(null, type);
		// => {ext: 'png', mime:'image/png'} 
	}
});


```
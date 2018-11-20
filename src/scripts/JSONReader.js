'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JSONReader = function () {
    function JSONReader() {
        var completed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        _classCallCheck(this, JSONReader);

        this.onCompleted = completed;
        this.result = undefined;
        this.input = document.createElement('input');
        this.input.type = 'file';
        this.input.accept = 'text/json|application/json';
        this.input.addEventListener('change', this.onChange.bind(this), false);
        this.input.style.display = 'none';
        document.body.appendChild(this.input);
        this.input.click();
    }

    _createClass(JSONReader, [{
        key: 'destroy',
        value: function destroy() {
            this.input.removeEventListener('change', this.onChange.bind(this), false);
            document.body.removeChild(this.input);
        }
    }, {
        key: 'onChange',
        value: function onChange(event) {
            if (event.target.files.length > 0) {
                this.readJSON(event.target.files[0]);
            }
        }
    }, {
        key: 'readJSON',
        value: function readJSON(file) {
            var _this = this;

            var reader = new FileReader();
            reader.onload = function (event) {
                if (event.target.readyState === 2) {
                    _this.result = JSON.parse(reader.result);
                    if (typeof _this.onCompleted === 'function') {
                        _this.onCompleted(_this.result);
                    }
                    _this.destroy();
                }
            };
            reader.readAsText(file);
        }
    }], [{
        key: 'read',
        value: function read() {
            var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

            return new JSONReader(callback);
        }
    }]);

    return JSONReader;
}();

/* class JSONReader {
    constructor(completed = null) {
        this.onCompleted = completed;
        this.result = undefined;
	this.input = document.createElement('input');
        this.input.type = 'file';
        this.input.accept = 'text/json|application/json';
        this.input.addEventListener('change', this.onChange.bind(this), false);
        this.input.style.display = 'none';
        document.body.appendChild(this.input);
        this.input.click();
    }

    destroy() {
        this.input.removeEventListener('change', this.onChange.bind(this), false);
        document.body.removeChild(this.input);
    }

    onChange(event) {
	if (event.target.files.length > 0) {
            this.readJSON(event.target.files[0]);
        }
    }

    readJSON(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target.readyState === 2) {
                this.result = JSON.parse(reader.result);
                if (typeof this.onCompleted === 'function') {
                    this.onCompleted(this.result);
                }
		this.destroy();
            }
        };
        reader.readAsText(file);
    }

    static read(callback = null) {
        return new JSONReader(callback);
    }
} */
/**
 // Usage (1)
    JSONReader.read((result) => {
        console.log(result);
    });
// Usage (2)
    const reader = new JSONReader((result) => {
        console.log(result);
    });
*/

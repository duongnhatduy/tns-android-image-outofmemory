var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../tns_modules/image-source/image-source.d.ts"/>
/// <reference path="../tns_modules/ui/image-cache/image-cache.d.ts"/>
/// <reference path="../tns_modules/data/observable/observable.d.ts"/>
var image_source_1 = require("image-source");
var main_view_model_1 = require("./main-view-model");
var observable_1 = require("data/observable");
var ISLOADING = "isLoading";
var THUMBNAIL_IMAGE = "thumbnailImage";
var SocnetOrderSet = (function () {
    function SocnetOrderSet(name, point, shared, viewCount) {
        if (shared === void 0) { shared = false; }
        if (viewCount === void 0) { viewCount = 0; }
        this.name = name;
        this.point = point;
        this.shared = shared;
        this.viewCount = viewCount;
    }
    return SocnetOrderSet;
})();
var Post = (function (_super) {
    __extends(Post, _super);
    function Post(source) {
        _super.call(this);
        this._isLoading = false;
        this._source = source;
        if (source) {
            for (var property in source) {
                this[property] = source[property];
            }
        }
    }
    Object.defineProperty(Post.prototype, "source", {
        get: function () {
            return this._source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "socnetOrderSet", {
        get: function () {
            var socnetOrderSet = [];
            for (var key in Post.allSocnetList) {
                var socnet = Post.allSocnetList[key];
                if (this._source[socnet + "Point"]) {
                    var socnetObject = new SocnetOrderSet(socnet, this._source[socnet + "Point"], this._source[socnet + "Shared"], this._source[socnet + "ViewCount"]);
                    socnetOrderSet.push(socnetObject);
                }
            }
            return socnetOrderSet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "thumbnailImage", {
        get: function () {
            var _this = this;
            if (!this._source) {
                return main_view_model_1.defaultImageSource;
            }
            var url = this._source.imageUrl;
            if (!_isValidImageUrl(url)) {
                return main_view_model_1.defaultImageSource;
            }
            var image = main_view_model_1.cache.get(url);
            if (image) {
                return image_source_1.fromNativeSource(image);
            }
            this._isLoading = true;
            main_view_model_1.cache.push({
                key: url,
                url: url,
                completed: function (image, key) {
                    if (url === key) {
                        _this._isLoading = false;
                        if (image) {
                            var sourceimage = image_source_1.fromNativeSource(image);
                            _this.notify({ object: _this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: THUMBNAIL_IMAGE, value: sourceimage });
                        }
                    }
                }
            });
            return main_view_model_1.defaultImageSource;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Post.prototype, "isLoading", {
        get: function () {
            return this._isLoading;
        },
        set: function (value) {
            if (this._isLoading !== value) {
                this._isLoading = value;
                this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: ISLOADING, value: value });
            }
        },
        enumerable: true,
        configurable: true
    });
    Post.allSocnetList = ["facebook", "linkedin", "twitter", "weibo", "xing"];
    return Post;
})(observable_1.Observable);
exports.Post = Post;
function _isValidImageUrl(url) {
    return url && (url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1);
}

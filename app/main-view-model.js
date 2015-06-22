var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../tns_modules/data/observable/observable.d.ts"/>
/// <reference path="../tns_modules/data/observable/observable-array.d.ts"/>
/// <reference path="../tns_modules/ui/frame/frame.d.ts"/>
/// <reference path="../tns_modules/http/http.d.ts"/>
/// <reference path="../tns_modules/ui/dialogs/dialogs.d.ts"/>
/// <reference path="../tns_modules/ui/image-cache/image-cache.d.ts"/>
/// <reference path="../tns_modules/image-source/image-source.d.ts"/>
var observable_1 = require("data/observable");
var observable_array_1 = require("data/observable-array");
var http_1 = require("http");
var post_item_model_1 = require("./post-item-model");
var image_cache_1 = require("ui/image-cache");
var image_source_1 = require("image-source");
var ISSCROLLING = "isLoading";
var POSTLIST = "postList";
exports.cache = new image_cache_1.Cache();
exports.defaultImageSource = image_source_1.fromFile("~/res/placeholder1.jpg");
exports.cache.placeholder = exports.defaultImageSource;
exports.cache.maxRequests = 5;
var PostListMV = (function (_super) {
    __extends(PostListMV, _super);
    function PostListMV() {
        _super.apply(this, arguments);
        this._isLoading = false;
        this._isScrolling = false;
    }
    Object.defineProperty(PostListMV.prototype, "postList", {
        get: function () {
            if (!this._postList) {
                this._postList = new observable_array_1.ObservableArray();
                this.loadMorePost();
            }
            return this._postList;
        },
        enumerable: true,
        configurable: true
    });
    PostListMV.prototype.loadMorePost = function () {
        var _this = this;
        if (!this._isLoading) {
            this._isLoading = true;
            console.log("Frommmmmmmmmmmmmmmmm ", this.from);
            return http_1.getJSON("http://smarp.smarpshare.com/api/post?type=all" +
                (this.from ? "&from=" + this.from : "")).then(function (result) {
                if (result && _this._isLoading) {
                    var itemsToLoad = result.map(function (i) {
                        return new post_item_model_1.Post(i);
                    });
                    _this._postList.push(itemsToLoad);
                    _this.notify({ object: _this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: POSTLIST, value: _this._postList });
                    _this._isLoading = false;
                }
            }, function (e) {
                console.log(e);
                _this._isLoading = false;
            })
                .catch(function (e) {
                this._isLoading = false;
                setTimeout(function () { throw e; });
            });
        }
        else {
            return new Promise(function (resolve, reject) {
                reject();
            });
        }
    };
    PostListMV.prototype.refresh = function () {
        this._postList = new observable_array_1.ObservableArray();
        return this.loadMorePost();
    };
    Object.defineProperty(PostListMV.prototype, "from", {
        get: function () {
            if (this._postList) {
                var lastItem = this._postList.getItem(this._postList.length - 1);
                if (lastItem) {
                    return lastItem.order;
                }
            }
            return;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PostListMV.prototype, "isScrolling", {
        get: function () {
            return this._isScrolling;
        },
        set: function (value) {
            if (this._isScrolling !== value) {
                this._isScrolling = value;
                if (value) {
                    exports.cache.disableDownload();
                }
                else {
                    exports.cache.enableDownload();
                }
                this.notify({ object: this, eventName: observable_1.Observable.propertyChangeEvent, propertyName: ISSCROLLING, value: value });
            }
        },
        enumerable: true,
        configurable: true
    });
    return PostListMV;
})(observable_1.Observable);
var mainViewModel = new PostListMV();
exports.default = mainViewModel;

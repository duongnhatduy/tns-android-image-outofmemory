/// <reference path="../tns_modules/data/observable/observable.d.ts"/>
/// <reference path="../tns_modules/data/observable/observable-array.d.ts"/>
/// <reference path="../tns_modules/ui/frame/frame.d.ts"/>
/// <reference path="../tns_modules/http/http.d.ts"/>
/// <reference path="../tns_modules/ui/dialogs/dialogs.d.ts"/>
/// <reference path="../tns_modules/ui/image-cache/image-cache.d.ts"/>
/// <reference path="../tns_modules/image-source/image-source.d.ts"/>
import {Observable} from "data/observable";
import {ObservableArray} from "data/observable-array";
import {topmost} from "ui/frame";
import {getJSON} from "http";
import {Post} from "./post-item-model";
import {Cache} from "ui/image-cache";
import {ImageSource, fromFile} from "image-source";
import {PostModel} from "./post-model";
var ISSCROLLING = "isLoading";
var POSTLIST = "postList"

export var cache = new Cache();
export var defaultImageSource = fromFile("~/res/placeholder1.jpg");
cache.placeholder = defaultImageSource;
cache.maxRequests = 5;

class PostListMV extends Observable {
    private _postList: ObservableArray<Post>;
    private _isLoading = false;
    get postList(): ObservableArray<Post> {
        if (!this._postList) {
            this._postList = new ObservableArray<Post>();
            this.loadMorePost();
        }
        return this._postList;
    }

    public loadMorePost(): Promise {
        if (!this._isLoading) {
            this._isLoading = true;
            console.log("Frommmmmmmmmmmmmmmmm ", this.from);
            return getJSON<PostModel>("http://smarp.smarpshare.com/api/post?type=all" +
                (this.from ? "&from=" + this.from : "")).then(result => {
                    if (result && this._isLoading) {
                        var itemsToLoad = result.map(i => {
                            return new Post(i);
                        });
                        this._postList.push(itemsToLoad);
                        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: POSTLIST, value: this._postList });
                        this._isLoading = false;
                    }
                }, (e) => {// Argument (e) is Error!
                    console.log(e);
                    this._isLoading = false;
                })
                .catch(function(e) {
                    this._isLoading = false;
                    setTimeout(function() { throw e; });
                });
        } else {
            //Still loading, do nothing
            return new Promise<T>((resolve, reject) => {
                reject();
            });
        }
    }

    public refresh(): Promise {
        this._postList = new ObservableArray<Post>();
        return this.loadMorePost();
    }

    get from(): string {
        if (this._postList) {
            var lastItem = this._postList.getItem(this._postList.length - 1);
            if (lastItem) {
                return lastItem.order;
            }
        }
        return;
    }

    private _isScrolling = false;

    get isScrolling(): boolean {
        return this._isScrolling;
    }

    set isScrolling(value: boolean) {
        if (this._isScrolling !== value) {
            this._isScrolling = value;

            if (value) {
                cache.disableDownload();
            }
            else {
                cache.enableDownload();
            }

            this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: ISSCROLLING, value: value });
        }
    }
}

var mainViewModel = new PostListMV();
export default mainViewModel;

/// <reference path="../tns_modules/image-source/image-source.d.ts"/>
/// <reference path="../tns_modules/ui/image-cache/image-cache.d.ts"/>
/// <reference path="../tns_modules/data/observable/observable.d.ts"/>
import {ImageSource, fromNativeSource, fromUrl} from "image-source";
import {cache, defaultImageSource} from "./main-view-model";
import {Observable, EventData} from "data/observable";
import {PostModel, SocnetOrderSet as SocnetDefinition} from "./post-model";

var ISLOADING = "isLoading";
var THUMBNAIL_IMAGE = "thumbnailImage";

class SocnetOrderSet implements SocnetDefinition{
    constructor(
        public name: string,
        public point: number,
        public shared?: boolean = false,
        public viewCount?: number = 0,
        ) {
    }
}
//@@TODO Id as mongoDB.ObjectId
export class Post extends Observable {
    private _source: PostModel;
    //@@TODO This should be company socnetList
    static allSocnetList: string[] = ["facebook", "linkedin", "twitter", "weibo", "xing"];
    private _isLoading = false;

    constructor(source: PostModel){
        super();
        this._source = source;
        if (source) {
            for (var property in source) {
                this[property] = source[property];
            }
        }
    }
    get source(): PostModel {
        return this._source;
    }
    get socnetOrderSet(): SocnetOrderSet{
        var socnetOrderSet = [];
        for (var key in Post.allSocnetList) {
            var socnet = Post.allSocnetList[key];
            if (this._source[socnet + "Point"]) {
                var socnetObject = new SocnetOrderSet(socnet, this._source[socnet + "Point"], this._source[socnet + "Shared"], this._source[socnet + "ViewCount"])
                socnetOrderSet.push(socnetObject);
            }
        }
        return socnetOrderSet;
    }
    get thumbnailImage(): ImageSource {

        //Fetch and cache image if not available
        // Set image if cache is available    
        if (!this._source) {
            return defaultImageSource;
        }

        var url = this._source.imageUrl;

        if (!_isValidImageUrl(url)) {
            return defaultImageSource;
        }

        var image = cache.get(url);
        if (image) {
            return fromNativeSource(image);
        }

        this._isLoading = true;
        cache.push({
            key: url,
            url: url,
            completed: (image: any, key: string) => {
                if (url === key) {
                    this._isLoading = false;
                    if (image) {
                        var sourceimage = fromNativeSource(image);
                        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: THUMBNAIL_IMAGE, value: sourceimage });
                    }
                }
            }
        });
        return defaultImageSource;
    }

    get isLoading(): boolean {
        return this._isLoading;
    }
    set isLoading(value: boolean) {
        if (this._isLoading !== value) {
            this._isLoading = value;
            this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: ISLOADING, value: value });
        }
    }
}
function _isValidImageUrl(url: string): boolean {
    return url && (url.indexOf(".png") !== -1 || url.indexOf(".jpg") !== -1);
}

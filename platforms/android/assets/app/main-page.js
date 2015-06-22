/// <reference path="../tns_modules/data/observable/observable.d.ts"/>
/// <reference path="../tns_modules/ui/page/page.d.ts"/>
/// <reference path="../tns_modules/ui/frame/frame.d.ts"/>
/// <reference path="../tns_modules/ui/list-view/list-view.d.ts"/>
/// <reference path="../tns_modules/ui/gestures/gesture.d.ts"/>
var main_view_model_1 = require("./main-view-model");
var frame_1 = require("ui/frame");
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = main_view_model_1.default;
}
exports.pageLoaded = pageLoaded;
function shareTapHandler(args) {
    var context = args.view.bindingContext;
    context.socnetClicked = args.view.get("id");
    frame_1.topmost().navigate({
        moduleName: "detailpage/detail-page",
        context: context,
    });
}
exports.shareTapHandler = shareTapHandler;
function imageTapHandler(args) {
    var context = args.view.bindingContext;
    frame_1.topmost().navigate({
        moduleName: "previewpage/preview-page",
        context: context,
    });
}
exports.imageTapHandler = imageTapHandler;
function refresh(args) {
    main_view_model_1.default.refresh()
        .then(function () {
        args.done();
    })
        .catch(function (e) {
        setTimeout(function () { throw e; });
    });
    ;
}
exports.refresh = refresh;
function listViewLoadMoreItems(args) {
    main_view_model_1.default.loadMorePost();
}
exports.listViewLoadMoreItems = listViewLoadMoreItems;

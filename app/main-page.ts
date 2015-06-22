/// <reference path="../tns_modules/data/observable/observable.d.ts"/>
/// <reference path="../tns_modules/ui/page/page.d.ts"/>
/// <reference path="../tns_modules/ui/frame/frame.d.ts"/>
/// <reference path="../tns_modules/ui/list-view/list-view.d.ts"/>
/// <reference path="../tns_modules/ui/gestures/gesture.d.ts"/>
import mainViewModel from "./main-view-model";
import {EventData} from "data/observable";
import {Page} from "ui/page";
import {topmost, NavigationEntry} from "ui/frame";
import {RefreshEventData} from "ui/list-view";
import {GestureEventData} from "ui/gestures";
// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: EventData) {
  var page: Page = <any>args.object;
  page.bindingContext = mainViewModel;
}

export function shareTapHandler(args: GestureEventData) {
  var context = args.view.bindingContext;
  context.socnetClicked = args.view.get("id");
  topmost().navigate(<NavigationEntry>{
    moduleName: "detailpage/detail-page",
    context: context,
  });
}

export function imageTapHandler(args: GestureEventData) {
  var context = args.view.bindingContext;
  topmost().navigate(<NavigationEntry>{
    moduleName: "previewpage/preview-page",
    context: context,
  });
}

export function listViewLoadMoreItems(args: EventData) {
  mainViewModel.loadMorePost();
}

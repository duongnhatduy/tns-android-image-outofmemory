export interface CategoryMap {
    Division: string[];
}
export interface SocnetOrderSet {
    name: string;
    point: number;
    shared?: boolean;
    viewCount?: number;
}
export interface PostModel {
    _id: string;
    url: string;
    title: string;
    body: string;
    TagList: string[];
    categoryMap: CategoryMap;
    companyId: string;
    facebookCommentSet: string[];
    facebookPoint: number;
    facebookShared: boolean;
    facebookViewCount: number;
    imageUrl: string;
    linkedinCommentSet: string[];
    linkedinPoint: number;
    linkedinShared: boolean;
    linkedinViewCount: number;
    order: number;
    twitterCommentSet: string[];
    twitterPoint: number;
    twitterShared: boolean;
    twitterViewCount: number;
    weiboCommentSet: string[];
    weiboPoint: number;
    weiboShared: boolean;
    weiboViewCount: number;
    xingCommentSet: string[];
    xingPoint: number;
    xingShared: boolean;
    xingViewCount: number;
}

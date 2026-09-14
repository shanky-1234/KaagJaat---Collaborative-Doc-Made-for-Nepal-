export type DocumentOrientation = "portrait" | "landscape";

export type PageSizes = "A4" | "A3" | "A5" | "LETTER"

export type DocumentMargins = {
    top:number,
    left:number,
    right:number,
    bottom:number
}

export type DocumentSettingType = {
    pageSize:PageSizes,
    orientation:DocumentOrientation,
    margin:DocumentMargins
}
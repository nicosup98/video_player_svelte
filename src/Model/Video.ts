export interface Video {
    id: string,
    data: string,
    name: string
}
export interface StoreVideo {
    [key: string]: Video
}
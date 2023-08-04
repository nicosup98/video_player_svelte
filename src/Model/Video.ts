export interface Video {
    id: string,
    data: string,
    name: string,
    isYt: boolean,
}

export interface StoreVideo {
    [key: string]: Video
}
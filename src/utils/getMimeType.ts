const MIME_TYPES = {
    mp4: "video/mp4",
    webm:"video/webm",
    ogv:"video/ogg"
}
export function getMimeType(ext: string){
    return MIME_TYPES[ext]
}
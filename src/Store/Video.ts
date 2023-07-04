import { writable } from "svelte/store"
import {nanoid} from "nanoid"
import type { StoreVideo, Video } from "src/Model/Video"
function createVideoStore(){
    const {subscribe,set,update} = writable<StoreVideo>({})
  
    return {
        subscribe,
        addVideo: (video: {name: string, data: string}) => update(videos => {
            const id = nanoid()
            const {name,data} = video
            videos[id] ={data,id,name} ; 
            return videos
        }),
        removeVideo: (id: string) => update(videos => {delete videos[id]; return videos}),
        removeAll: () => set({}),
    }
}

function createSelectedStore(){
    const {subscribe,set} = writable<string>("a")

    return {
        subscribe,
        select: (id: string)=> set(id)
    }

}

export const videos = createVideoStore()
export const videoSelected = createSelectedStore()
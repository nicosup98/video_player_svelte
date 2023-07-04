<script lang="ts">
    import { videos,videoSelected } from "../Store/Video"
    import VideoPlayer from "svelte-video-player"
    import {open} from "@tauri-apps/api/dialog"
    import { readBinaryFile } from "@tauri-apps/api/fs"
    import { basename,extname } from "@tauri-apps/api/path"
    import { videoDir } from '@tauri-apps/api/path';

    let loading = false
    const MIME_TYPES = {
        mp4: "video/mp4",
        webm:"video/webm",
        ogv:"video/ogg"
    }

    async function openVideo(){
        loading = true
        const paths = await open({multiple:true,defaultPath:await videoDir(),recursive:true,directory:false,filters:[{name:"video",extensions:["mp4","webm","ogv"]}]})
        if (!Array.isArray(paths)) return
        for(const p of paths) {
            const file = new Blob([await readBinaryFile(p)],{type:MIME_TYPES[await extname(p)]})
            const name = await basename(p)
            const data = URL.createObjectURL(file)
            videos.addVideo({data,name})
        }
        loading = false
    }
</script>
<div>
    {#each  Object.entries($videos) as video (video[1].id)}
        {#if $videoSelected === video[0]}
            <VideoPlayer source={video[1].data}/>    
        {/if}
        
    {/each}
    {#each Object.entries($videos) as video (video[1].id)}
        <button class="button" on:click={()=> videoSelected.select(video[1].id)}>{video[1].name}</button>
    {/each}
    <button class="button" on:click={openVideo}>agregar</button>
    <button class="button" on:click={()=>console.log({video:$videos})}>log</button>
    <span hidden={!loading}>loading...</span>
</div>


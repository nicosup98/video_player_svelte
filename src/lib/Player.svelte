<script lang="ts">
  import { videos, videoSelected } from "../Store/Video";
  import VideoPlayer from "svelte-video-player";
  import { open } from "@tauri-apps/api/dialog";
  import { readBinaryFile } from "@tauri-apps/api/fs";
  import { basename, extname } from "@tauri-apps/api/path";
  import { videoDir } from "@tauri-apps/api/path";
  import { slide } from "svelte/transition";
  import { sineInOut } from "svelte/easing";
  import { getMimeType } from "../utils/getMimeType";
  import { nanoid } from "nanoid";
  import Youtube from "svelte-youtube-embed";


  let loading = false;
  let ytLink = "";
  const MIME_TYPES = {
    mp4: "video/mp4",
    webm: "video/webm",
    ogv: "video/ogg",
  };

  async function openVideo() {
    loading = true;
    const paths = await open({
      multiple: true,
      defaultPath: await videoDir(),
      recursive: true,
      directory: false,
      filters: [{ name: "video", extensions: ["mp4", "webm", "ogv"] }],
    });
    if (!Array.isArray(paths)) return;
    for (const p of paths) {
      const file = new Blob([await readBinaryFile(p)], {
        type: getMimeType(await extname(p)),
      });
      const name = await basename(p);
      const data = URL.createObjectURL(file);
      videos.addVideo({ data, name});
    }
    loading = false;
  }

  async function addYtVideo(e: KeyboardEvent) {
    if (e.key !== "Enter" || ytLink.trim() === "") return;
    loading = true;
    videos.addVideoYt({ url: ytLink });
    ytLink = "";
    loading = false;
  }
</script>

<div>
  {#each Object.entries($videos) as video (video[1].id)}
    {#if $videoSelected === video[0]}
      <div transition:slide={{ delay: 100, duration: 200, easing: sineInOut }}>
        {#if video[1].isYt}
          <Youtube id={video[1].data} animations={false} />
        {:else}
          <VideoPlayer source={video[1].data} borderRadius={"0px"} />
        {/if}
      </div>
    {/if}
  {/each}
  {#each Object.entries($videos) as video (video[1].id)}
    <button class="button" on:click={() => videoSelected.select(video[1].id)}
      >{video[1].name}</button
    >
  {/each}
  <div class="is-flex is-flex-direction-row">
    <button class="button m-1" on:click={openVideo}>agregar archivo</button>
    <input
      class="input m-1"
      type="text"
      placeholder="agregar video de youtube, enter para agregar"
      on:keydown={addYtVideo}
      bind:value={ytLink}
    />
    <span hidden={!loading}>loading...</span>
  </div>
</div>

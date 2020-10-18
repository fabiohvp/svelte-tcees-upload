<script>
  import Upload from "./upload/Upload.svelte";
  import { validations } from "./validations";
  let upload;

  function onFileUpdate(event) {
    console.log(event.detail.fileProps);
  }
</script>

<Upload
  bind:this={upload}
  numberFiles={2}
  {validations}
  on:fileUpdate={onFileUpdate} />
<button on:click={() => console.log(upload.getFiles())}>getfiles</button>

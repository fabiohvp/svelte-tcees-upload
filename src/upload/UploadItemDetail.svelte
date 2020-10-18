<script>
  import { createEventDispatcher } from "svelte";
  import Icon from "fa-svelte";
  import { faPaste, faTimes } from "@fortawesome/free-solid-svg-icons";
  const dispatch = createEventDispatcher();

  export let file;
  export let fileProps;

  function onChange(event) {
    fileProps.descricaoComplementar = event.target.value;
    dispatch("update", { file, fileProps });
  }

  function onClickPaste() {
    fileProps.descricaoComplementar = file.name;
    dispatch("update", { file, fileProps });
  }

  function onClickRemove() {
    dispatch("remove", { file });
  }
</script>

<style>
  .icon {
    float: right;
    color: #ccc;
    cursor: pointer;
  }
  .icon > :global(svg) {
    margin-left: 7px;
  }
  .icon > :global(svg:hover) {
    color: black;
  }

  .input {
    border: none;
    background-color: transparent;
  }

  .input:focus {
    border: 1px solid;
    outline: none;
  }
</style>

<div>
  <span>{file.name}</span>
  <span class="icon">
    <span on:click={onClickPaste}><Icon icon={faPaste} /></span>
    <span on:click={onClickRemove}><Icon icon={faTimes} /></span>
  </span>
</div>
<div>
  <input
    type="text"
    class="input"
    value={fileProps.descricaoComplementar || ''}
    placeholder="Descrição complementar"
    on:change={onChange} />
</div>

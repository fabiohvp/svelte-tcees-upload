<script>
  import { createEventDispatcher, onMount } from "svelte";
  import Icon from "fa-svelte";
  import { faCheck, faMinus, faTimes } from "@fortawesome/free-solid-svg-icons";

  const dispatch = createEventDispatcher();

  export let file;
  export let index;
  export let validation;

  onMount(async () => {
    if (!validation.result) {
      if (validation.fn) {
        const result = await validation.fn(file, validation);
        validateCallback({ index, result });
      } else {
        validateCallback({ index, result: { type: "?" } });
      }
    }
  });

  function validateCallback(args) {
    dispatch("validate", args);
  }
</script>

{#if validation.result}
  <span>
    {#if validation.result.type === 'success'}
      <span style="color: green;"><Icon icon={faCheck} /></span>
    {:else}
      <span style="color: red;"><Icon icon={faTimes} /></span>
    {/if}
  </span>
{:else}
  <span>
    <span><Icon icon={faMinus} /></span>
  </span>
{/if}

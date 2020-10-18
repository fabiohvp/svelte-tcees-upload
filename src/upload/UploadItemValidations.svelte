<script>
  import { createEventDispatcher, getContext } from "svelte";
  import { key } from "./uploadContext";
  import UploadItemValidation from "./UploadItemValidation.svelte";

  const dispatch = createEventDispatcher();
  const { filesProps } = getContext(key);

  export let file;

  function onValidate(event) {
    const { index, result } = event.detail;
    const _filesProps = { ...$filesProps };
    const validations = _filesProps[file.name].validations;

    validations[index] = {
      ...validations[index],
      result,
    };

    $filesProps = _filesProps;
    dispatch("validate", { file, result });

    const finishValidations =
      validations.filter((o) => o.result).length === validations.length;

    if (finishValidations) {
      dispatch("upload", { file, result }); //defer execution to after hook is executed
    }
  }
</script>

{#each $filesProps[file.name].validations as validation, i (validation)}
  <td class="text-center">
    <UploadItemValidation
      {file}
      index={i}
      {validation}
      on:validate={onValidate} />
  </td>
{/each}

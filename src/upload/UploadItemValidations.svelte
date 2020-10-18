<script>
  import { createEventDispatcher } from "svelte";
  import UploadItemValidation from "./UploadItemValidation.svelte";

  const dispatch = createEventDispatcher();

  export let file;
  export let fileProps;

  function onValidate(event) {
    const { index, result } = event.detail;
    const _fileProps = { ...fileProps };
    const validations = _fileProps.validations;

    validations[index] = {
      ...validations[index],
      result,
    };

    fileProps = _fileProps;
    dispatch("validate", { file, result });

    const finishValidations =
      validations.filter((o) => o.result).length === validations.length;

    if (finishValidations) {
      dispatch("upload", { file, result }); //defer execution to after hook is executed
    }
  }
</script>

{#each fileProps.validations as validation, i (validation)}
  <td class="text-center">
    <UploadItemValidation
      {file}
      index={i}
      {validation}
      on:validate={onValidate} />
  </td>
{/each}

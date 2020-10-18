<script>
  import { createEventDispatcher, getContext } from "svelte";
  import { key } from "./uploadContext";
  import api from "../api";
  import ProgressBar from "../progressBar/ProgressBar.svelte";
  import UploadItemValidations from "./UploadItemValidations.svelte";

  const dispatch = createEventDispatcher();
  const { filesProps } = getContext(key);

  export let file;
  let progress = 0;
  let uploading = false;

  async function upload() {
    return await api.upload("http://localhost:8000/upload", file, (event) => {
      progress = Math.floor((event.loaded / event.total) * 100);
    });
  }

  async function onUpload() {
    let _filesProps = { ...$filesProps };
    const canUpload =
      !_filesProps[file.name].error &&
      _filesProps[file.name].validations.filter(
        (o) => o.result.type !== "error"
      ).length === _filesProps[file.name].validations.length;

    _filesProps[file.name].clientValidated = true;

    if (canUpload) {
      progress = 0;
      uploading = true;

      try {
        const data = await upload();
        _filesProps[file.name].uploaded = true;
        _filesProps[file.name].nome = data.Dados[file.name].File;
        _filesProps[file.name].validations = mergeValidations(
          data.Dados[file.name].Validations,
          _filesProps[file.name].validations
        );
      } catch (err) {
        _filesProps[file.name].error = true;
        _filesProps[file.name].exception = err;
        //todo: add error when upload fails
      } finally {
        uploading = false;
      }
    } else {
      _filesProps[file.name].error = true;
    }
    $filesProps = _filesProps;
  }

  function onValidate(event) {
    dispatch("validate", event.detail);
  }

  function mergeValidations(clientValidations, serverValidations) {
    for (let i = 0; i < clientValidations.length; i++) {
      const serverValidation = serverValidations.find(
        (o) => o.key === clientValidations[i].Key
      );
      clientValidations[i] = {
        ...serverValidation,
        ...clientValidations[i],
        server: true,
      };
    }
    return clientValidations;
  }
</script>

<tr>
  <td>
    <slot name="detail" {file} />
  </td>
  {#if uploading}
    <td colspan={$filesProps[file.name].validations.length}>
      <ProgressBar {progress} />
    </td>
  {:else if $filesProps[file.name].validate}
    <UploadItemValidations
      {file}
      on:validate={onValidate}
      on:upload={onUpload} />
  {:else}
    <td
      colspan={$filesProps[file.name].validations.length}
      style="color:red;"
      class="text-center">
      Arquivo não processado, limite maximo de arquivos atingido.
    </td>
  {/if}
  <slot name="action" {file} />
</tr>

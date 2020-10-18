<script>
  import api from "../api";
  import ProgressBar from "../progressBar/ProgressBar.svelte";
  import UploadItemValidations from "./UploadItemValidations.svelte";

  export let file;
  export let fileProps;

  let progress = 0;
  let uploading = false;

  async function upload() {
    return await api.upload("http://localhost:8000/upload", file, (event) => {
      progress = Math.floor((event.loaded / event.total) * 100);
    });
  }

  function canUpload() {
    return (
      !fileProps.error &&
      fileProps.validations.filter((o) => o.result.type !== "error").length ===
        fileProps.validations.length
    );
  }

  async function onUpload() {
    const _fileProps = { ...fileProps };
    _fileProps.clientValidated = true;

    if (canUpload()) {
      progress = 0;
      uploading = true;

      try {
        const data = await upload();
        _fileProps.uploaded = true;
        _fileProps.nome = data.Dados[file.name].File;
        _fileProps.validations = mergeValidations(
          data.Dados[file.name].Validations,
          _fileProps.validations
        );
      } catch (err) {
        _fileProps.error = true;
        _fileProps.exception = err;
        //todo: add error when upload fails
      } finally {
        uploading = false;
      }
    } else {
      _fileProps.error = true;
    }
    fileProps = _fileProps;
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
    <slot name="detail" {file} {fileProps} />
  </td>
  {#if uploading}
    <td colspan={fileProps.validations.length}>
      <ProgressBar {progress} />
    </td>
  {:else if fileProps.validate}
    <UploadItemValidations {file} {fileProps} on:upload={onUpload} />
  {:else}
    <td
      colspan={fileProps.validations.length}
      style="color:red;"
      class="text-center">
      Arquivo não processado, limite maximo de arquivos atingido.
    </td>
  {/if}
  <slot name="action" {file} {fileProps} />
</tr>

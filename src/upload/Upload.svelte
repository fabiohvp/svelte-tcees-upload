<script>
  import { createEventDispatcher } from "svelte";
  import { writable } from "svelte/store";
  import UploadItem from "./UploadItem.svelte";
  import UploadItemDetail from "./UploadItemDetail.svelte";
  const dispatch = createEventDispatcher();

  export let files = [];
  export let filesProps = {};
  export let numberFiles = 1;
  export let props = {};
  export let validations = [];
  let actions = false;

  function selectFile(event) {
    const _files = [];
    const _filesProps = { ...filesProps };
    let needsUpdate = false;

    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];

      if (!files.find((o) => o.name === file.name)) {
        needsUpdate = true;

        const validate = files.length + i < numberFiles;
        _filesProps[file.name] = {
          validations: [...validations],
          error: !validate,
          validate,
        };
        _files.push(file);
      }
    }
    if (needsUpdate) {
      files = files.concat(_files);
      filesProps = _filesProps;
    }
  }

  function onFileRemove(event) {
    const { file } = event.detail;
    const _filesProps = { ...filesProps };
    delete _filesProps[file.name];

    files = files.filter((_file) => _file.name !== file.name);

    files.forEach((_file, i) => {
      const validate = i < numberFiles;
      if (!_filesProps[_file.name].clientValidated) {
        _filesProps[_file.name].error = !validate;
      }
      _filesProps[_file.name].validate = validate;
    });
    filesProps = _filesProps;
    dispatch("fileRemove", { file });
  }

  function onFileUpdate(event) {
    const { file, fileProps } = event.detail;
    filesProps = { ...filesProps, [file.name]: fileProps };
    dispatch("fileUpdate", { file, fileProps });
  }

  function onFileUpload(event) {
    dispatch("fileUpload", getFiles());
  }

  export function getFiles() {
    return {
      files: files,
      filesProps: filesProps,
    };
  }

  export function isProcessing() {
    return (
      Object.keys(filesProps).filter(
        (key) => !filesProps[key].uploaded && !filesProps[key].error
      ).length > 0
    );
  }
</script>

<style>
  [hidden] {
    display: none !important;
  }
</style>

<div class="upload" {...props}>
  <label class="btn btn-default">
    Selecionar arquivo
    <input
      type="file"
      hidden
      multiple={numberFiles > 1}
      on:change={selectFile} />
  </label>

  <table class="table table-striped">
    <thead>
      <tr>
        <th class="col-lg-4">Arquivo</th>
        {#each validations as validation}
          <th class="text-center">
            <span
              style="transform: rotate(320deg); display: block; padding-left: 40px;">
              {validation.title}
            </span>
          </th>
        {/each}
        {#if actions}
          <th>Ações</th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each files as file (file.name)}
        <UploadItem
          {file}
          fileProps={filesProps[file.name]}
          on:upload={onFileUpload}>
          <span slot="detail" let:file>
            <UploadItemDetail
              {file}
              fileProps={filesProps[file.name]}
              on:remove={onFileRemove}
              on:update={onFileUpdate} />
          </span>
          <slot name="item" slot="item" />
        </UploadItem>
      {/each}
    </tbody>
  </table>
</div>

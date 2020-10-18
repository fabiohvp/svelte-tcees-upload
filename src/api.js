async function _get(url, options) {
  return fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    ...options,
  }).then((res) => res.json());
}

function _post(url, body, options) {
  return fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...options,
  }).then((res) => res.json());
}

async function _put(url, body, options) {
  return fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...options,
  }).then((res) => res.json());
}

async function _delete(url, body, options) {
  return fetch(url, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...options,
  }).then((res) => res.json());
}

async function _upload(url, file, onUploadProgress) {
  let formData = new FormData();

  formData.append("name", file.name);
  formData.append("file", file);

  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open("post", url);
    xhr.onload = (e) => resolve(JSON.parse(e.target.responseText));
    xhr.onerror = reject;
    if (xhr.upload && onUploadProgress)
      xhr.upload.onprogress = onUploadProgress;
    xhr.send(formData);
  });
}

export default {
  get: _get,
  post: _post,
  put: _put,
  delete: _delete,
  upload: _upload,
};

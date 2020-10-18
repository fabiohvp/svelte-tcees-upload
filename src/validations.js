export const validations = [
  {
    key: "TamanhoMaximoValidate",
    title: "Tamanho",
    fn: (file, validation) => {
      if (file.size < 65000000) {
        return { type: "success" };
      }
      return { type: "error", ocr: true };
    },
  },
  {
    key: "ExtensaoValidate",
    title: "Extensão",
    fn: (file, validation) => {
      return { type: "success" };
    },
  },
  {
    key: "PdfJSignValidate",
    title: "Assinatura",
    fn: (file, validation) => {
      return { type: "success" };
    },
  },
];

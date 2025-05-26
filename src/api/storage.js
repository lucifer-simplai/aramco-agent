import _authHttp from "../services/authHttp";
import config from "../utils/apiEndpoints";

export const downloadDocumentApi = ({ resource_id, doc_id }) => {
  return _authHttp.get(config.storage.download, {
    params: {
      resource_id,
      doc_id,
    },
    responseType: "blob",
  });
};

import _authHttp from "../services/authHttp";
import config from "../utils/apiEndpoints";

export const getRootChildrenApi = ({ params = {}, headers = {} }) => {
  return _authHttp.get(config.tracing.getRootChildren, { params });
};

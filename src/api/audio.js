import _authHttp from "../services/authHttp";
import config from "../utils/apiEndpoints";

export const livekitTokenApi = ({ payload = {}, headers = {} }) => {
  return _authHttp.post(config.agents.livekitToken, payload, {
    headers,
  });
};

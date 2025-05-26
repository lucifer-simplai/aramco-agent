import _authHttp from "../services/authHttp";
import config from "../utils/apiEndpoints";

export const initiateConversationApi = ({
  payload = {},
  headers = {},
  signal,
}) => {
  return _authHttp.post(config.intract.initiateConversation, payload, {
    headers,
    signal,
  });
};

export const submitUserMessageFeedbackApi = ({
  payload = {},
  headers = {},
  signal,
}) => {
  return _authHttp.post(config.chatFeedback.submitFeedback, payload, {
    headers,
    signal,
  });
};

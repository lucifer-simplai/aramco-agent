const __EDGE_URL__ = process.env.REACT_APP_EDGE_BASE_URL;
const __EDGE_EXTERNAL_URL__ = process.env.REACT_APP_EDGE_EXTERNAL_BASE_URL;
export const CHATBOT_BASE_URL = process.env.REACT_APP_CHATBOT_APP_BASE_URL;
const __IDENTITY_BASE_URL__ = process.env.REACT_APP_IDENTITY_BASE_URL;
const __INTRACT_BASE_URL__ = process.env.REACT_APP_INTERACT_BASE_URL;
const __DATA_BASE_URL__ = process.env.REACT_APP_DATA_BASE_URL;
const __INTRACT_BASE_PUBLIC_URL__ =
  process.env.REACT_APP_INTERACT_BASE_PUBLIC_URL;
const __AGENT_BASE_URL__ = process.env.REACT_APP_AGENT_SERVICE_BASE_URL;
const __EVALUATION_BASE_URL__ = process.env.REACT_APP_EVALUATION_BASE_URL;
const __MODEL_BASE_URL__ = process.env.REACT_APP_MODEL_BASE_URL;
const __CHANNEL_AGGREGATOR_BASE_URL__ =
  process.env.REACT_APP_CHANNEL_AGGREGATOR_BASE_URL;
const __WEBHOOK_CONSUMER_BASE_URL__ =
  process.env.REACT_APP_WEBHOOK_CONSUMER_BASE_URL;

export const BASE_URLS = {
  identity: `${__EDGE_URL__}${__IDENTITY_BASE_URL__}`,
  intract: `${__EDGE_URL__}${__INTRACT_BASE_URL__}`,
  intractExternal: `${__EDGE_EXTERNAL_URL__}${__INTRACT_BASE_URL__}`,
  agent: `${__EDGE_URL__}${__AGENT_BASE_URL__}`,
  data: `${__EDGE_URL__}${__DATA_BASE_URL__}`,
  evaluation: `${__EDGE_URL__}${__EVALUATION_BASE_URL__}`,
  model: `${__EDGE_URL__}${__MODEL_BASE_URL__}`,
  channelAggregator: `${__EDGE_URL__}${__CHANNEL_AGGREGATOR_BASE_URL__}`,
  webhook: `${__EDGE_URL__}${__WEBHOOK_CONSUMER_BASE_URL__}`,
  // Use public url for interact because of timeout
  // `${__EDGE_URL__}${__INTRACT_BASE_URL__}`,
};

const config = {
  identity: {
    createSession: `${BASE_URLS.identity}/session/create`,
    getGuestSession: `${BASE_URLS.identity}/user/token`,
  },
  intract: {
    initiateConversation: `${BASE_URLS.intract}/api/v1/intract/embed/conversation`,
    streamResponse: `${BASE_URLS.intractExternal}/api/v1/intract/data`,
    chatHistoryList: `${BASE_URLS.intract}/api/v1/intract/embed/conversation`,
    chatDetails: `${BASE_URLS.intract}/api/v1/intract/embed/conversation`,
  },
  embed: {
    config: `${BASE_URLS.intract}/api/v1/intract/embed/config`,
  },
  agents: {
    details: `${BASE_URLS.agent}/agents`,
    livekitToken: `${BASE_URLS.agent}/getToken`,
  },
  dataset: {
    uploadFile: `${BASE_URLS.data}/api/v1/storage/upload`,
  },
  storage: {
    download: `${BASE_URLS.data}/api/v1/storage/download`,
  },
  chatFeedback: {
    userFeedback: `${BASE_URLS.intract}/api/v1/feedback`,
    submitFeedback: `${BASE_URLS.intract}/api/v1/feedback`,
  },
  tracing: {
    getAllRoots: `${BASE_URLS.evaluation}/api/v2/trace`,
    getRootChildren: `${BASE_URLS.evaluation}/api/v2/trace/tree`,
    download: `${BASE_URLS.evaluation}/api/v2/trace/download`,
  },
  tools: {
    executeRetry: `${BASE_URLS.agent}/tools/step-retry-async`,
    templates: `${BASE_URLS.agent}/tools/public`,
    allsteps: `${BASE_URLS.agent}/steps/`,
  },
  workflow2: {
    list: `${BASE_URLS.agent}/workflows/`,
    publishedList: `${BASE_URLS.agent}/workflows/published`,
    details: `${BASE_URLS.agent}/workflows`,
    update: `${BASE_URLS.agent}/workflows`,
    create: `${BASE_URLS.agent}/workflows/`,
    delete: `${BASE_URLS.agent}/workflows`,
    clone: `${BASE_URLS.agent}/workflows/clone`,
    nodeConfig: `${BASE_URLS.agent}/workflows/nodes`,
    execute: `${BASE_URLS.agent}/workflows/execute_workflow`,
    executeAsync: `${BASE_URLS.agent}/workflows/execute_workflow_async`,
    executeAsyncDraft: `${BASE_URLS.agent}/workflows/execute_workflow_draft_async`,
    versionList: `${BASE_URLS.agent}/workflows`,
    workflowVersionDetails: `${BASE_URLS.agent}/workflows`,
    createWorkflowVersion: `${BASE_URLS.agent}/workflows`,
    publishWorkflowVersion: `${BASE_URLS.agent}/workflows`,
    jobStatus: `${BASE_URLS.agent}/workflows/jobs`,
    jobDetails: `${BASE_URLS.agent}/workflows/jobs`,
    templates: `${BASE_URLS.agent}/workflows/public`,
    stopJob: `${BASE_URLS.agent}/workflows/stop-workflow-execution`,
  },
  knowledgebase: {
    list: `${BASE_URLS.data}/api/v1/dataset/knowledgebase`,
    create: `${BASE_URLS.data}/api/v1/dataset/knowledgebase`,
    update: `${BASE_URLS.data}/api/v1/dataset/knowledgebase`,
    delete: `${BASE_URLS.data}/api/v1/dataset/knowledgebase`,
    addFiles: `${BASE_URLS.data}/api/v1/dataset/knowledgebase/add-file`,
    retryIngestion: `${BASE_URLS.data}/api/v1/dataset/knowledgebase/ingestion/retry`,
    files: `${BASE_URLS.data}/api/v1/dataset/knowledgebase/files`,
    fileDelete: `${BASE_URLS.data}/api/v1/dataset/knowledgebase/document`,
    dependencies: `${BASE_URLS.channelAggregator}/api/v1/kb/kb-cascade-details`,
    jobList: `${BASE_URLS.schedule}/api/v1/cron-setup/schedule-jobs`,
    createJob: `${BASE_URLS.schedule}/api/v1/cron-setup/schedule-jobs`,
    deleteJob: `${BASE_URLS.schedule}/api/v1/cron-setup/unschedule/job`,
  },
  workspace: {
    // models: `${BASE_URLS.model}/api/v1/user/model`,  old endpoint for models in workspace
    models: `${BASE_URLS.model}/api/v2/user/model`,
    modelV2: `${BASE_URLS.model}/api/v2/user/model`,
    userModelDetails: `${BASE_URLS.model}/api/v1/user/model`,
    importModel: `${BASE_URLS.model}/api/v1/user/model/import`,
    importLoRA: `${BASE_URLS.model}/api/v1/model/training/lora/import`,
    addToWorkspace: `${BASE_URLS.model}/api/v1/user/model`,
    deploy: `${BASE_URLS.model}/api/v1/user/model/deploy`,
    remove: `${BASE_URLS.model}/api/v1/user/model`,
    connect: `${BASE_URLS.model}/api/v2/user/model/connect`,
    markIdle: `${BASE_URLS.model}/api/v2/user/model/mark-idle`,
    startTuning: `${BASE_URLS.model}/api/v1/model/training/job`,
    deleteJob: `${BASE_URLS.model}/api/v1/model/training/job`,
    dependencies: `${BASE_URLS.channelAggregator}/api/v1/model-pipeline/model-cascade-details`,
  },
  integrate: {
    channels: `${BASE_URLS.channelAggregator}/api/v1/chat-channel`,
    allChannels: `${BASE_URLS.channelAggregator}/api/v1/chat-channel/all`,
    create: `${BASE_URLS.channelAggregator}/api/v1/chat-channel`,
    connection: `${BASE_URLS.channelAggregator}/api/v1`,
    webhook: `${BASE_URLS.webhook}/api/v1/webhook`,
  },
  serviceProvider: {
    allSources: `${BASE_URLS.channelAggregator}/api/v1/services/providers`,
    deleteApiKey: `${BASE_URLS.channelAggregator}/api/v1/services/key`,
    addApiKey: `${BASE_URLS.channelAggregator}/api/v1/services/keys`,
  },
};

export default config;

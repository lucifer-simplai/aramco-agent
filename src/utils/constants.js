// Auth constants
export const PERMISSION_TYPE = {
  OR: "OR",
  AND: "AND",
};

// date format constants
export const tokenDateFormat = "YYYY-MM-DDTHH:mm:ss.ssssss";
export const updatedTokenDateFormat = "YYYY-MM-DDTHH:mm:ss.sss";
export const dateFormatForBackend = "YYYY-MM-DDTHH:mm:ss";
export const dateFormatForFrontend = "DD-MM-YYYY";
export const dateFormatForFrontendNew = "DD/MM/YYYY";
export const dateFormatYMD = "YYYY-MM-DD";
export const timeFormatForFrontend = "hh:mm A";
export const dateTimeFormatWithMilliseconds = "DD-MM-YYYY hh:mm:ss A";
export const dateTimeFormatYMDWithMilliseconds = "YYYY-MM-DD hh:mm:ss A";
export const dateTimeFormatWithMillisecondsWithoutTimeZone =
  "DD-MM-YYYY HH:mm:ss";

export const dateTimeFormatScheduler = "YYYY-MM-DD HH:mm:ss [GMT]Z";

export const dateTimeFormatYMDWithoutTimeZone = "YYYY-MM-DD HH:mm";

export const dateTimeFormatYMDWithMillisecondsWithoutTimeZone =
  "YYYY-MM-DD HH:mm:ss";

// common headers constants
export const X_USER_ID = "X-USER-ID";
export const X_SELLER_ID = "X-SELLER-ID";
export const X_CLIENT_ID = "X-CLIENT-ID";
export const X_SELLER_PROFILE_ID = "X-SELLER-PROFILE-ID";
export const X_PROJECT_ID = "X-PROJECT-ID";
export const X_TENANT_ID = "X-TENANT-ID";
export const X_DEVICE_ID = "X-DEVICE-ID";
export const PIM_SID = "PIM-SID";

// Dummy data constants
export const DUMMY_SELLER_ID = "1";
export const DUMMY_SELLER_PROFILE_ID = "11";

// pagination constants
export const DEFAULT_PAGE = 0;
export const DEFAULT_PAGE_FROM_ONE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const ALL_DATA_PAGE_SIZE = 2000;
export const DEFAULT_CARD_PAGE_SIZE = 18;

// sorting constants
export const SortingOrders = {
  descend: "desc",
  ascend: "asc",
};

export const OperationStatuses = {
  IDLE: "IDLE",
  PENDING: "Pending",
  SUCCESS: "Success",
  ERROR: "Error",
};

// symbols
export const DollarSymbol = "$";

export const StepIOTypes = {
  TEXT: "TEXT",
  JSON: "JSON",
};

// Page mode
export const PAGE_MODE = {
  CREATE: "CREATE",
  VIEW: "VIEW",
  EDIT: "EDIT",
};

export const Page_Type = {
  auth: "AUTH",
  unauth: "UNAUTH",
};

export const CountryOptions = {
  AU: "Australia",
  AT: "Austria",
  BE: "Belgium",
  BR: "Brazil",
  BG: "Bulgaria",
  CA: "Canada",
  HR: "Croatia",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  EE: "Estonia",
  FI: "Finland",
  FR: "France",
  DE: "Germany",
  GH: "Ghana",
  GI: "Gibraltar",
  GR: "Greece",
  HK: "Hong Kong",
  HU: "Hungary",
  IN: "India",
  ID: "Indonesia",
  IE: "Ireland",
  IT: "Italy",
  JP: "Japan",
  KE: "Kenya",
  LV: "Latvia",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MY: "Malaysia",
  MT: "Malta",
  MX: "Mexico",
  NL: "Netherlands",
  NZ: "New Zealand",
  NG: "Nigeria",
  NO: "Norway",
  PL: "Poland",
  PT: "Portugal",
  RO: "Romania",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  ZA: "South Africa",
  ES: "Spain",
  SE: "Sweden",
  CH: "Switzerland",
  TH: "Thailand",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
};

export const JobTitles = [
  "Data Science",
  "Engineering",
  "Product Management",
  "Sales",
  "Marketing",
  "Customer Support",
  "Human Resources",
  "Other",
];

export const marks = {
  0: "0",
  1: "1",
};

export const drawerSize = {
  small: 512,
  medium: 728,
  large: typeof window !== "undefined" ? window?.innerWidth - 196 : 1480,
  cover: typeof window !== "undefined" ? window?.innerWidth : 1480,
};

export const fullWidth = { width: "100%" };
export const guideLinks = {
  dataset: "https://simplai.ai/docs/dataset",
  knowledgebase: "https://simplai.ai/docs/Knowledge_base/",
};

export const blockedPlans = [1, "1"];

export const chatAttachmentString = "ATTACHED FILE:";

export const disabledToolStepFields = [
  "vector_db",
  "filter_keys",
  "vector_index_keys",
  "source",
  "embedding_source",
  "embed_model_name",
  "collection_name",
  "kb_type",
];

export const dummyConnectorsWorkspaceId =
  "56047ba3-8086-46db-b344-0164a4e3c030";

export const dummyDesctinationId = "d0b1e50d-2a9a-4d65-8881-354ccb88ca3f";

export const noStyleFormItem = { margin: 0 };

export const triggerRuleOptions = [
  {
    label: "All success",
    value: "all_success",
    description: "Trigger only when all incoming nodes are successful",
  },
  {
    label: "Any success",
    value: "any_success",
    description: "Trigger when the first incoming node is successful",
  },
];
export const projectsExcludedClients = [2, "2"];

export const experienceCenterProjectId = -1;

export const aggregateAvailableForToolIds = [
  "674b2817c5575b711d8c6ae2",
  "674abfe1e35cb809745799ca",
];

export const heygenAgentId = [
  "675bfc1e289e558e90ab8a90",
  "6757fd7328fea24315eedbbe",
  "675bba3aa0b5d60c001afd3e",
];
export const heygenApiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;

export const docgenblockedTenants = [2, "2"];

export const secureModeTenants = []; // added tenant ids to block copy paste and print

export const RNNOISE_BASE =
  "https://unpkg.com/@sapphi-red/web-noise-suppressor@0.3.5/dist";
export const WORKLET_URL = `${RNNOISE_BASE}/rnnoise/workletProcessor.js`;
export const WASM_URL = `${RNNOISE_BASE}/rnnoise.wasm`;
export const SIMD_WASM = `${RNNOISE_BASE}/rnnoise_simd.wasm`;

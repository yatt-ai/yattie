export const IPC_HANDLERS = {
  CAPTURE: "capture",
  DATABASE: "database",
  FILE_SYSTEM: "fileSystem",
  STORE: "store",
};

export const IPC_FUNCTIONS = {
  GET_MEDIA_SOURCE: "getMediaSource",
  SAVE_NOTE: "saveNote",
  CREATE_IMAGE: "createImage",
  UPDATE_IMAGE: "updateImage",
  CREATE_VIDEO: "createVideo",
  UPDATE_VIDEO: "updateVideo",
  DELETE_FILE: "deleteFile",
  UPLOAD_EVIDENCE: "uploadEvidence",
  CREATE_TEMP_USER_MEDIA: "createTempUserMedia",
  SAVE_USER_MEDIA: "saveUserMedia",
  UPDATE_USER_MEDIA: "updateUserMedia",
  OPTIMIZE_VIDEO: "optimizeVideo",
  OPEN_ADD_WINDOW: "openAddWindow",
  CLOSE_ADD_WINDOW: "closeAddWindow",
  OPEN_EDIT_WINDOW: "openEditWindow",
  CLOSE_EDIT_WINDOW: "closeEditWindow",
  OPEN_SETTING_WINDOW: "openSettingWindow",
  CLOSE_SETTING_WINDOW: "closeSettingWindow",
  SET_WINDOW_SIZE: "setWindowSize",
  GET_IMAGE_DATA: "getImageData",
  SET_APPERANCE: "setApperance",

  INITIALIZE_SESSION: "initializeSession",
  GET_ITEMS: "getItems",
  UPDATE_ITEMS: "updateItems",
  DELETE_ITEMS: "deleteItems",
  GET_ITEM_BY_ID: "getItemById",
  GET_CONFIG: "getConfig",
  UPDATE_CONFIG: "updateConfig",

  EXPORT_ITEMS: "exportItems",
  SAVE_SESSION: "saveSession",
  OPEN_SESSION: "openSession",
  EXPORT_SESSION: "exportSession",
};

export const STATUSES = {
  SUCCESS: "success",
  ERROR: "error",
  WARNING: "warning",
};

export const SESSION_STATUSES = {
  PENDING: "pending",
  START: "start",
  PAUSE: "pause",
  RESUME: "resume",
  PROCEED: "proceed",
  END: "end",
};

export const SESSION_TYPES = ["Screenshot", "Video", "Audio", "Note"];

export const TEXT_TYPES = [
  "Comment",
  "Problem",
  "Suggestion",
  "Idea",
  "Question",
  "Concern",
  "Positive",
];

export const MAP_NODES = [
  {
    id: "5e274797-4db7-4fe8-a983-8b8abf8771c5",
    text: "Exploratory Test",
    url: "https://features.yattie.ai",
    fx: -210.9125181819311,
    fy: -583.1010883631283,
  },
  {
    id: "4763495c-62b7-4625-9083-2d40045b6550",
    text: "Nav Dropdown",
    fx: 99.1983655368465,
    fy: -582.6407249084972,
  },
  {
    id: "02441b12-6ef7-4316-a560-9fff8166c50b",
    text: "Profile",
    fx: 401.48698934678123,
    fy: -580.086170175959,
  },
  {
    id: "ab3d94cc-59c9-43be-ac16-161d25538ba5",
    text: "Settings",
    fx: 404.99180349461017,
    fy: -474.9312827698253,
  },
  {
    id: "1bca0f6d-cb21-470c-b5a9-40c88b7ced6b",
    text: "Notifications",
    fx: 405.421819058575,
    fy: -369.3725364319347,
  },
  {
    id: "6ea5b16c-8cf5-4bc3-8338-4837971c3493",
    text: "Logout",
    fx: 408.2212003146785,
    fy: -256.08161235966907,
  },
];

export const MAP_CONNECTIONS = [
  {
    source: "5e274797-4db7-4fe8-a983-8b8abf8771c5",
    target: "4763495c-62b7-4625-9083-2d40045b6550",
  },
  {
    source: "4763495c-62b7-4625-9083-2d40045b6550",
    target: "02441b12-6ef7-4316-a560-9fff8166c50b",
  },
  {
    source: "4763495c-62b7-4625-9083-2d40045b6550",
    target: "ab3d94cc-59c9-43be-ac16-161d25538ba5",
  },
  {
    source: "4763495c-62b7-4625-9083-2d40045b6550",
    target: "ab3d94cc-59c9-43be-ac16-161d25538ba5",
  },
  {
    source: "4763495c-62b7-4625-9083-2d40045b6550",
    target: "1bca0f6d-cb21-470c-b5a9-40c88b7ced6b",
  },
  {
    source: "4763495c-62b7-4625-9083-2d40045b6550",
    target: "6ea5b16c-8cf5-4bc3-8338-4837971c3493",
  },
];

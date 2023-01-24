export const IPC_HANDLERS = {
  CAPTURE: "capture",
  DATABASE: "database",
  FILE_SYSTEM: "fileSystem",
  STORE: "store",
  MENU: "menu",
  WINDOW: "window",
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
  CREATE_AUDIO: "createAudio",
  CREATE_TEMP_USER_MEDIA: "createTempUserMedia",
  SAVE_USER_MEDIA: "saveUserMedia",
  UPDATE_USER_MEDIA: "updateUserMedia",
  OPTIMIZE_VIDEO: "optimizeVideo",
  DROP_FILE: "dropFile",

  OPEN_ADD_WINDOW: "openAddWindow",
  CLOSE_ADD_WINDOW: "closeAddWindow",
  OPEN_EDIT_WINDOW: "openEditWindow",
  CLOSE_EDIT_WINDOW: "closeEditWindow",
  OPEN_SETTING_WINDOW: "openSettingWindow",
  CLOSE_SETTING_WINDOW: "closeSettingWindow",
  OPEN_MINIMIZE_WINDOW: "openMinimizeWindow",
  CLOSE_MINIMIZE_WINDOW: "closeMinimizeWindow",
  CLOSE_SESSION_AND_MINIIMIZED_WINDOW: "closeSessionAndMinimizedWindow",
  OPEN_MODAL_WINDOW: "openModalWindow",
  CLOSE_MODAL_WINDOW: "closeModalWindow",
  SET_WINDOW_SIZE: "setWindowSize",
  GET_IMAGE_DATA: "getImageData",
  SET_APPERANCE: "setApperance",
  OPEN_NOTES_WINDOW: "openNotesWindow",
  CLOSE_NOTES_WINDOW: "closeNotesWindow",
  MOVE_WINDOW: "moveWindow",

  INITIALIZE_SESSION: "initializeSession",
  ADD_ITEM: "addItem",
  GET_ITEMS: "getItems",
  UPDATE_ITEMS: "updateItems",
  DELETE_ITEMS: "deleteItems",
  GET_ITEM_BY_ID: "getItemById",
  GET_CONFIG: "getConfig",
  UPDATE_CONFIG: "updateConfig",
  GET_METADATA: "getMetaData",
  UPDATE_METADATA: "updateMetaData",

  GET_NOTES: "getNotes",
  UPDATE_NOTES: "updateNotes",
  RESET_DATA: "resetData",

  EXPORT_ITEMS: "exportItems",
  EXPORT_NOTES: "exportNotes",
  SAVE_SESSION: "saveSession",
  OPEN_SESSION: "openSession",
  EXPORT_SESSION: "exportSession",
  OPEN_CONFIG_FILE: "openConfigFile",
  DRAG_ITEM: "dragItem",

  CHANGE_MENUITEM_STATUS: "changeMenuItemStatus",
};

export const IPC_BIND_KEYS = {
  CLOSED_NOTE_DIALOG: "note_dialog_closed",
  CLOSED_SUMMARY_DIALOG: "summary_dialog_closed",
  MODAL_DATA: "modal_data",
  END_SESSION: "end_session",
  CLOSED_MINIMIZE_WINDOW: "minimize_window_closed",
  CLOSED_ENDSESSION_DIALOG: "endsession_dialog_closed",
  CLOSED_SOURCEPICKER_DIALOG: "sourcepicker_dialog_closed",
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

export const SESSION_TYPES = [
  "Screenshot",
  "Video",
  "Audio",
  "Note",
  "File",
  "Mindmap",
];

export const VIEW_MODE = {
  NORMAL: "normal",
  MINI: "minimized",
};

export const TEXT_TYPES = [
  "Comment",
  "Problem",
  "Suggestion",
  "Idea",
  "Question",
  "Concern",
  "Positive",
  "Summary",
];

export const VIDEO_RESOLUTION = [
  {
    type: "high",
    width: 1920,
    height: 1080,
  },
  {
    type: "standard",
    width: 1024,
    height: 768,
  },
  {
    type: "low",
    width: 640,
    height: 480,
  },
];

export const DEFAULT_CHARTER_MAP_NODES = [
  {
    id: "5e274797-4db7-4fe8-a983-8b8abf8771c5",
    text: "System Under Test",
    url: "https://features.yattie.ai",
    fx: -210.9125181819311,
    fy: -583.1010883631283,
  },
  {
    id: "4763495c-62b7-4625-9083-2d40045b6550",
    text: "Feature #1",
    fx: 99.1983655368465,
    fy: -582.6407249084972,
  },
];

export const DEFAULT_CHARTER_MAP_CONNECTIONS = [
  {
    source: "5e274797-4db7-4fe8-a983-8b8abf8771c5",
    target: "4763495c-62b7-4625-9083-2d40045b6550",
  },
];

export const DEFAULT_MAP_NODES = [
  {
    id: "5e274797-4db7-4fe8-a983-8b8abf8771c5",
    text: "Mind Map",
    url: "https://features.yattie.ai",
    fx: -210.9125181819311,
    fy: -583.1010883631283,
  },
  {
    id: "4763495c-62b7-4625-9083-2d40045b6550",
    text: "First Node",
    fx: 99.1983655368465,
    fy: -582.6407249084972,
  },
];

export const DEFAULT_MAP_CONNECTIONS = [
  {
    source: "5e274797-4db7-4fe8-a983-8b8abf8771c5",
    target: "4763495c-62b7-4625-9083-2d40045b6550",
  },
];

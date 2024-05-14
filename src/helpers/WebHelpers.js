const { DEFAULT_FILE_TYPES } = require("@/modules/constants");
const uuidv4 = require("uuid");

module.exports.createImageForWeb = (url) => {
  const fileType = DEFAULT_FILE_TYPES["image"].type;
  const { stepID, attachmentID, fileName } = generateIDAndName("image");

  const base64Response = atob(url.split(",")[1]);
  const binaryData = new Uint8Array(base64Response.length);
  for (let i = 0; i < base64Response.length; i++) {
    binaryData[i] = base64Response.charCodeAt(i);
  }
  let blob = new Blob([binaryData], { type: fileType });

  const filePath = URL.createObjectURL(blob);
  const fileSize = blob.size;

  return {
    item: {
      stepID,
      attachmentID,
      fileName,
      filePath,
      fileSize,
      fileType,
    },
  };
};

module.exports.updateImageForWeb = ({ item, url }) => {
  const { fileName } = item.fileName
    ? { fileName: item.fileName }
    : generateIDAndName("image");
  const base64Response = atob(url.split(",")[1]);
  const binaryData = new Uint8Array(base64Response.length);
  for (let i = 0; i < base64Response.length; i++) {
    binaryData[i] = base64Response.charCodeAt(i);
  }
  let blob = new Blob([binaryData], { type: item.fileType });

  const filePath = URL.createObjectURL(blob);
  const fileSize = blob.size;

  return {
    item: {
      fileName,
      filePath,
      fileSize,
    },
  };
};

module.exports.createMindmapForWeb = ({ item, url }) => {
  const { fileName } = item.fileName
    ? { fileName: item.fileName }
    : generateIDAndName("mindmap");
  const base64Response = atob(url.split(",")[1]);
  const binaryData = new Uint8Array(base64Response.length);
  for (let i = 0; i < base64Response.length; i++) {
    binaryData[i] = base64Response.charCodeAt(i);
  }
  let blob = new Blob([binaryData], { type: "image/png" });
  const filePath = URL.createObjectURL(blob);
  const fileSize = blob.size;

  return {
    item: {
      fileName,
      filePath,
      fileSize,
    },
  };
};

module.exports.createVideoForWeb = (blob) => {
  const fileType = DEFAULT_FILE_TYPES["video"].type;
  const { stepID, attachmentID, fileName } = generateIDAndName("video");

  // const base64Response = atob(url.split(",")[1]);
  // const binaryData = new Uint8Array(base64Response.length);
  // for (let i = 0; i < base64Response.length; i++) {
  //   binaryData[i] = base64Response.charCodeAt(i);
  // }
  // let blob = new Blob([binaryData], { type: fileType });

  const filePath = URL.createObjectURL(blob);
  const fileSize = blob.size;

  return {
    item: {
      stepID,
      attachmentID,
      fileName,
      filePath,
      fileSize,
      fileType,
    },
  };
};

module.exports.createAudioForWeb = (blob) => {
  const fileType = DEFAULT_FILE_TYPES["audio"].type;
  const { stepID, attachmentID, fileName } = generateIDAndName("audio");

  const filePath = URL.createObjectURL(blob);
  const fileSize = blob.size;

  return {
    item: {
      stepID,
      attachmentID,
      fileName,
      filePath,
      fileSize,
      fileType,
    },
  };
};

module.exports.saveNoteForWeb = (comment) => {
  const fileType = DEFAULT_FILE_TYPES["text"].type;
  const { stepID, attachmentID, fileName } = generateIDAndName("text");
  let blob = new Blob([comment.text], { type: fileType });
  const filePath = URL.createObjectURL(blob);
  const fileSize = blob.size;

  return {
    item: {
      stepID,
      attachmentID,
      fileName,
      filePath,
      fileSize,
      fileType,
    },
  };
};

const generateIDAndName = (type) => {
  const stepID = uuidv4();
  const attachmentID = uuidv4();
  const idStr = attachmentID.replaceAll("-", "");
  let suffix;

  // if (type === "poster") {
  //     type = "image";
  // }

  if (DEFAULT_FILE_TYPES[type]) {
    suffix = DEFAULT_FILE_TYPES[type].suffix;
  } else {
    suffix = "file";
  }
  const fileName = `${type}-${idStr}.${suffix}`;

  return { stepID, attachmentID, fileName };
};

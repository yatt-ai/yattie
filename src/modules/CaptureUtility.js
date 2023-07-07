const { app, remote, dialog, desktopCapturer } = require("electron");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const detect = require("detect-file-type");
const uuidv4 = require("uuid");

const ffmpeg = require("fluent-ffmpeg");

const ffmpegPath = require("ffmpeg-static").replace(
  "app.asar",
  "app.asar.unpacked"
);
const ffprobePath = require("ffprobe-static").path.replace(
  "app.asar",
  "app.asar.unpacked"
);

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

const browserUtility = require("./BrowserWindowUtility");
const { STATUSES } = require("./constants");

const configDir = (app || remote.app).getPath("userData");

module.exports.getMediaSource = async () => {
  const sources = await desktopCapturer.getSources({
    thumbnailSize: {
      width: 150,
      height: 100,
    },
    types: ["window", "screen"],
  });

  return sources.map((source) => {
    return {
      id: source.id,
      name: source.name,
      thumbnail: source.thumbnail.toDataURL(),
    };
  });
};

module.exports.createImage = ({ url, poster }) => {
  const imageType = poster ? "video-thumb" : "image";
  const { id, fileName } = generateIDAndName(imageType);
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  const base64Data = url.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(filePath, base64Data, "base64", function (err) {
    if (err) {
      console.log(err);
    }
  });
  return {
    id,
    fileName,
    filePath,
  };
};

module.exports.updateImage = ({ item, url }) => {
  if (item.filePath && fs.existsSync(item.filePath)) {
    fs.unlinkSync(item.filePath);
  }
  const fileName = item.fileName || generateIDAndName("image", item.id);
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  const base64Data = url.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(filePath, base64Data, "base64", function (err) {
    if (err) {
      console.log(err);
    }
  });
  return {
    status: STATUSES.SUCCESS,
    filePath: filePath,
  };
};

module.exports.createVideo = ({ buffer }) => {
  const { id, fileName } = generateIDAndName("video");
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  fs.writeFileSync(filePath, Buffer.from(buffer), function (err) {
    if (err) {
      console.log(err);
    }
  });
  return {
    id,
    fileName,
    filePath,
  };
};

module.exports.optimizeVideo = ({ filePath }) => {
  const tempName = "temp-optimizing-video-" +
    dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") +
    ".mp4";
  const tempPath = path.join(configDir, "sessions", "userMedia", tempName);

  return new Promise(function (resolve, reject) {
    ffmpeg(filePath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .format("mp4")
      .save(tempPath)
      .on("start", function (commandLine) {
        console.log("start : " + commandLine);
      })
      .on("progress", function (progress) {
        console.log(progress);
      })
      .on("end", function () {
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        fs.rename(tempPath, filePath, function (err) {
          if (err) {
            console.log(err);
            return reject({ status: STATUSES.ERROR, msg: err });
          }
          return resolve({
            status: STATUSES.SUCCESS,
          });
        });
      })
      .on("error", function (err) {
        console.log(err);
        return reject({ status: STATUSES.ERROR, msg: err });
      });
  });
};

module.exports.updateVideo = ({ item, start, end }) => {
  debugger;
  const tempName = "temp-optimizing-video-" +
    dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") +
    ".mp4";
  const tempPath = path.join(configDir, "sessions", "userMedia", tempName);
  const duration = parseInt(end - start);

  return new Promise(function (resolve, reject) {
    ffmpeg(item.filePath)
      .setStartTime(parseInt(start))
      .setDuration(duration)
      .save(tempPath)
      .on("start", function (commandLine) {
        console.log("start : " + commandLine);
      })
      .on("progress", function (progress) {
        console.log(progress);
      })
      .on("end", function () {
        if (item.filePath && fs.existsSync(item.filePath)) {
          fs.unlinkSync(item.filePath);
        }
        const fileName = item.fileName || generateIDAndName("video", item.id);
        const filePath = path.join(
          configDir, "sessions", "userMedia", fileName
        );
        fs.rename(tempPath, filePath, function (err) {
          if (err) {
            console.log(err);
            return reject({ status: STATUSES.ERROR, msg: err });
          }
          return resolve({
            status: STATUSES.SUCCESS,
            filePath: filePath,
          });
        });
      })
      .on("error", function (err) {
        console.log(err);
        return reject({ status: STATUSES.ERROR, msg: err });
      });
  });
};

module.exports.createAudio = ({ buffer }) => {
  const { id, fileName } = generateIDAndName("audio");
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  fs.writeFileSync(filePath, Buffer.from(buffer), function (err) {
    if (err) {
      console.log(err);
    }
  });
  return {
    id,
    fileName,
    filePath,
  };
};

module.exports.deleteFile = ({ filePath }) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports.saveNote = (comment) => {
  const { id, fileName } = generateIDAndName("text");
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  fs.writeFile(filePath, comment.text, function (err) {
    if (err) {
      console.log(err);
    }
  });
  return {
    id,
    fileName,
    filePath,
  };
};

module.exports.uploadEvidence = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile"],
  });

  if (canceled) {
    return Promise.resolve({
      status: STATUSES.ERROR,
      error: "No file selected",
    });
  }

  // TODO - Handle multiple files uploaded
  const id = uuidv4();
  const fileName = path.basename(filePaths[0]);
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);

  fs.copyFileSync(filePaths[0], filePath);

  // CTODO - move promise building to shared block with dropUpload
  return new Promise(function (resolve) {
    detect.fromFile(filePath, function (err, result) {
      if (err) {
        return resolve({
          status: STATUSES.ERROR,
          error: err,
        });
      }

      let fileType = "";
      if (result) {
        if (result.mime.substring(0, 6) === "image/") {
          fileType = "image";
        } else if (result.mime.substring(0, 6) === "video/") {
          fileType = "video";
        } else if (result.mime.substring(0, 6) === "audio/") {
          fileType = "audio";
        } else {
          fileType = "other";
        }
      } else {
        fileType = "other";
      }

      return resolve({
        status: STATUSES.SUCCESS,
        result: {
          id,
          fileType,
          fileName,
          filePath,
        },
      });
    });
  });
};

module.exports.dropFile = async (data) => {
  const id = uuidv4();
  const fileName = data.name;
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);

  fs.copyFileSync(data.path, filePath);

  return new Promise(function (resolve) {
    detect.fromFile(filePath, function (err, result) {
      if (err) {
        return resolve({
          status: STATUSES.ERROR,
          error: err,
        });
      }

      let fileType = "";
      if (result) {
        if (result.mime.substring(0, 6) === "image/") {
          fileType = "image";
        } else if (result.mime.substring(0, 6) === "video/") {
          fileType = "video";
        } else if (result.mime.substring(0, 6) === "audio/") {
          fileType = "audio";
        } else {
          fileType = "other";
        }
      } else {
        fileType = "other";
      }

      return resolve({
        status: STATUSES.SUCCESS,
        result: {
          id,
          fileType,
          fileName,
          filePath,
        },
      });
    });
  });
};

module.exports.createTempUserMedia = ({ buffer, fileName }) => {
  const filePath = path.join(configDir, "sessions", "tempUserMedia", fileName);
  fs.writeFileSync(filePath, Buffer.from(buffer), function (err) {
    if (err) {
      console.log(err);
    }
  });
  return filePath;
};

module.exports.createUserMedia = ({ buffer, fileName }) => {
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  fs.writeFileSync(filePath, Buffer.from(buffer), function (err) {
    if (err) {
      console.log(err);
    }
  });
  return filePath;
};

module.exports.updateUserMedia = ({ buffer, filePath, fileName }) => {
  const tempPath = path.join(configDir, "sessions", "tempUserMedia", fileName);
  console.log(fileName, filePath, tempPath);
  fs.writeFileSync(filePath, Buffer.from(buffer), function (err) {
    if (err) {
      console.log(err);
    }
  });
};

module.exports.setApperance = ({ apperance }) => {
  const browserWindow = browserUtility.getBrowserWindow();
  browserWindow.webContents.send("SET_THEME", { apperance });
};

module.exports.getImageData = (filePath) => {
  const data = base64_encode(filePath);
  return data;
};

const generateIDAndName = (type, uid = undefined) => {
  let id, idStr, fileName;
  let success = false;
  let suffix;

  switch (type) {
    case "video":
      suffix = "mp4";
      break;
    case "audio":
      suffix = "mp3";
      break;
    case "image":
    case "video-thumb":
      suffix = "png";
      break;
    default:
      suffix = "file";
  }

  while (!success) {
    id = uuidv4();
    idStr = id.replaceAll("-", "");
    for (let i=0; i < idStr.length-5; i++) {
      fileName = `${type}-${idStr.substring(i, 5)}.${suffix}`;
      if (
        !fs.existsSync(path.join(configDir, "sessions", "userMedia", fileName))
      ) {
        success = true;
        break;
      }
    }
  }
  if (uid) {
    id = uid;
  }
  return { id, fileName };
};

function base64_encode(file) {
  return "data:image/png;base64," + fs.readFileSync(file, "base64");
}

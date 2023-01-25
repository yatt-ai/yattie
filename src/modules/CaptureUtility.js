const { app, remote, dialog, desktopCapturer } = require("electron");
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const detect = require("detect-file-type");

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

module.exports.createImage = ({ url }) => {
  const fileName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".png";
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  const base64Data = url.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(filePath, base64Data, "base64", function (err) {
    if (err) {
      console.log(err);
    }
  });
  return {
    fileName: fileName,
    filePath: filePath,
  };
};

module.exports.updateImage = ({ item, url }) => {
  if (item.filePath && fs.existsSync(item.filePath)) {
    fs.unlinkSync(item.filePath);
  }
  const fileName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".png";
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  const base64Data = url.replace(/^data:image\/png;base64,/, "");
  fs.writeFile(filePath, base64Data, "base64", function (err) {
    if (err) {
      console.log(err);
    }
  });
  item.filePath = filePath;
  return item;
};

module.exports.createVideo = ({ buffer }) => {
  const fileName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".mp4";
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  fs.writeFileSync(filePath, Buffer.from(buffer), function (err) {
    if (err) {
      console.log(err);
    }
  });
  return {
    fileName: fileName,
    filePath: filePath,
  };
};

module.exports.optimizeVideo = ({ filePath }) => {
  const tempName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".mp4";
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

module.exports.updateVideo = ({ filePath, start, end }) => {
  const tempName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".mp4";
  const tempPath = path.join(configDir, "sessions", "userMedia", tempName);
  const duration = parseInt(end - start);

  return new Promise(function (resolve, reject) {
    ffmpeg(filePath)
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
        if (filePath && fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
        return resolve({
          status: STATUSES.SUCCESS,
          result: {
            fileName: tempName,
            filePath: tempPath,
          },
        });
      })
      .on("error", function (err) {
        console.log(err);
        return reject({ status: STATUSES.ERROR, msg: err });
      });
  });
};

module.exports.createAudio = ({ buffer }) => {
  const fileName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + ".mp3";
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  fs.writeFileSync(filePath, Buffer.from(buffer), function (err) {
    if (err) {
      console.log(err);
    }
  });
  // const oldPath = path.join(configDir, "zulip.mp3");
  // fs.copyFileSync(oldPath, filePath);
  return {
    fileName: fileName,
    filePath: filePath,
  };
};

module.exports.deleteFile = ({ filePath }) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports.saveNote = ({ fileName, comment }) => {
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);
  fs.writeFile(filePath, comment.text, function (err) {
    if (err) {
      console.log(err);
    }
  });
  return filePath;
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

  const baseName = path.basename(filePaths[0]);
  const fileName = baseName.replace(/\s+/g, "_").toLowerCase();
  const filePath = path.join(configDir, "sessions", "userMedia", fileName);

  fs.copyFileSync(filePaths[0], filePath);

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
        if (result.mime === "image/jpeg" || result.mime === "image/png") {
          fileType = "image";
        } else if (result.mime === "video/mp4") {
          fileType = "video";
        } else if (result.mime === "video/mp3") {
          fileType = "audio";
        } else {
          fileType = "other";
        }
      } else {
        fileType = "other";
      }

      const data = {
        fileType: fileType,
        fileName: fileName,
        filePath: filePath,
      };
      return resolve({
        status: STATUSES.SUCCESS,
        result: data,
      });
    });
  });
};

module.exports.dropFile = async (data) => {
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
        if (result.mime === "image/jpeg" || result.mime === "image/png") {
          fileType = "image";
        } else if (result.mime === "video/mp4") {
          fileType = "video";
        } else if (result.mime === "video/mp3") {
          fileType = "audio";
        } else {
          fileType = "other";
        }
      } else {
        fileType = "other";
      }

      const data = {
        fileType: fileType,
        fileName: fileName,
        filePath: filePath,
      };
      return resolve({
        status: STATUSES.SUCCESS,
        result: data,
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
module.exports.saveUserMedia = (data) => {
  if (data.fileName && data.filePath) {
    const arr = data.fileName.split(".");
    const tempName = dayjs().format("YYYY-MM-DD_HH-mm-ss-ms") + "." + arr[1];
    const filePath = path.join(configDir, "sessions", "userMedia", tempName);
    fs.rename(data.filePath, filePath, function (err) {
      if (err) {
        console.log(err);
      }
    });
    data.filePath = filePath;
    data.fileName = tempName;
  }

  if (data.posterName && data.posterPath) {
    const filePath = path.join(
      configDir,
      "sessions",
      "userMedia",
      data.posterName
    );
    fs.rename(data.posterPath, filePath, function (err) {
      if (err) {
        console.log(err);
      }
    });
    data.posterPath = filePath;
  }
  console.log(data);
  return data;
};

module.exports.setApperance = ({ apperance }) => {
  const browserWindow = browserUtility.getBrowserWindow();
  browserWindow.webContents.send("SET_THEME", { apperance });
};

module.exports.getImageData = (filePath) => {
  const data = base64_encode(filePath);
  return data;
};

function base64_encode(file) {
  return "data:image/png;base64," + fs.readFileSync(file, "base64");
}

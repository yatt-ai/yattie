import { IPC_HANDLERS, IPC_FUNCTIONS } from "../modules/constants";
import {
  doc,
  p,
  a,
  b,
  u,
  em,
  blockQuote,
  ul,
  ol,
  li,
  text,
  textColor,
  heading,
} from "@atlaskit/adf-utils/builders/";
import axios from "axios";
import dayjs from "dayjs";

const URLS = {
  projectIndex: {
    basic: "https://${URL}/rest/api/3/project",
    oauth: "https://api.atlassian.com/ex/jira/${ORG}/rest/api/3/project",
    server: "https://${URL}/rest/api/2/project",
  },
  issueSearch: {
    basic: "https://${URL}/rest/api/3/search",
    oauth: "https://api.atlassian.com/ex/jira/${ORG}/rest/api/3/search",
    server: "https://${URL}/rest/api/2/search",
  },
  projectGet: {
    basic: "https://${URL}/rest/api/3/project/${ID}",
    oauth: "https://api.atlassian.com/ex/jira/${ORG}/rest/api/3/project/${ID}",
    server: "https://${URL}/rest/api/2/project/${ID}",
  },
  issueTypeGet: {
    basic:
      "https://${URL}/rest/api/3/issue/createmeta?projectIds=${PROJ_ID}&issuetypeIds=${TYPE_ID}&expand=projects.issuetypes.fields",
    oauth:
      "https://api.atlassian.com/ex/jira/${ORG}/rest/api/3/issue/createmeta?projectIds=${PROJ_ID}&issuetypeIds=${TYPE_ID}&expand=projects.issuetypes.fields",
    server:
      "https://${URL}/rest/api/2/issue/createmeta?projectIds=${PROJ_ID}&issuetypeIds=${TYPE_ID}&expand=projects.issuetypes.fields",
  },
  attachmentCreate: {
    basic: "https://${URL}/rest/api/3/issue/${KEY}/attachments",
    oauth:
      "https://api.atlassian.com/ex/jira/${ORG}/rest/api/3/issue/${KEY}/attachments",
    server: "https://${URL}/rest/api/2/issue/${KEY}/attachments",
  },
  issueCreate: {
    basic: "https://${URL}/rest/api/3/issue",
    oauth: "https://api.atlassian.com/ex/jira/${ORG}/rest/api/3/issue",
    server: "https://${URL}/rest/api/2/issue",
  },
};

export default {
  replaceKeys(url, item) {
    // TODO - move to utility class
    let keys = [];
    let i = 0;
    while (i < url.length) {
      let searchURL = url.substring(i, url.length);
      let startMark = searchURL.indexOf("${");
      let keyLength = searchURL.substring(startMark, url.length).indexOf("}");
      let endMark = startMark + keyLength;
      if (startMark > -1 && endMark > -1) {
        keys.push(searchURL.substring(startMark + 2, endMark));
        i = i + endMark + 1;
      } else {
        i = url.length;
      }
    }
    for (const key of keys) {
      url = url.replace(
        `\${${key}}`,
        item[key.toLowerCase()] ? item[key.toLowerCase()] : `\${${key}}`
      );
    }
    return url;
  },
  getURL(credential, urlEndpoint, item = {}) {
    let url;
    if (credential.type === "basic") {
      url = URLS[urlEndpoint]["basic"].replace("${URL}", credential.url);
      url = this.replaceKeys(url, item);
    } else if (credential.type === "oauth") {
      if (!credential.url) {
        // TODO - Allow selecting of the org.
        url = URLS[urlEndpoint]["oauth"].replace(
          "${ORG}",
          credential.orgs[0].id
        );
        url = this.replaceKeys(url, item);
      } else {
        url = URLS[urlEndpoint]["server"].replace("${URL}", credential.url);
        url = this.replaceKeys(url, item);
      }
    }
    return url;
  },
  getHeaders(credential) {
    let authHeader;
    if (credential.type === "basic") {
      authHeader = `Basic ${credential.accessToken}`;
    } else if (credential.type === "oauth") {
      authHeader = `Bearer ${credential.accessToken}`;
    }
    return {
      Authorization: authHeader,
      Accept: "application/json",
      "X-Atlassian-Token": "no-check",
    };
  },
  async getProvidedURL(credential, url) {
    let returnResponse = {
      items: [],
    };
    const options = {
      headers: this.getHeaders(credential),
    };

    await axios
      .get(url, options)
      .then((response) => {
        if (response.status === 200) {
          returnResponse.items = response.data;
        }
      })
      .catch((error) => {
        returnResponse.error = {
          message: JSON.stringify(error.response.data.errors),
        };

        if (
          credential.type === "oauth" &&
          dayjs(credential.lastRefreshed) < dayjs().subtract(4, "minute") &&
          [401, 403].includes(error.response.status)
        ) {
          returnResponse.error.checkAuth = true;
        }
      });
    return returnResponse;
  },

  saveCredentials(credentials, data) {
    // TODO - can this be generalized and the key passed?
    let formattedData = this.formatData(data);

    if (!credentials) {
      credentials = {};
    }

    if (credentials.github && credentials.github.length > 0) {
      let matched = false;
      for (const [githubIndex, credential] of Object.entries(
        credentials.github
      )) {
        if (credential.user.id === formattedData.user.id) {
          credentials.github[githubIndex] = formattedData;
          matched = true;
        }
      }
      if (!matched) {
        credentials.github.push(formattedData);
      }
    } else {
      credentials.github = [formattedData];
    }

    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
      data: credentials,
    });

    return credentials;
  },
  htmlToADF(type, node) {
    // TODO - finish unimplemented types and move to OSS package
    // https://developer.atlassian.com/cloud/jira/platform/apis/document/viewer
    let returnContent = [];
    let nodeList = node.childNodes;
    for (let i = 0; i < nodeList.length; i++) {
      if (nodeList[i].nodeType === document.TEXT_NODE) {
        returnContent.push(text(nodeList[i].textContent));
      } else {
        returnContent.push(this.htmlToADF(nodeList[i].tagName, nodeList[i]));
      }
    }

    let allowedAttrs = [];
    let currentAttrs = {};
    switch (type) {
      case undefined:
        return text(...returnContent);
      case "SPAN":
        if (node.style.color) {
          return textColor({ color: this.rgbToHex(node.style.color) })(
            ...returnContent
          );
        } else {
          return text(...returnContent);
        }
      case "P":
        return p(...returnContent);
      case "H1":
        return heading({ level: 1 })(...returnContent);
      case "H2":
        return heading({ level: 2 })(...returnContent);
      case "H3":
        return heading({ level: 3 })(...returnContent);
      case "A":
        allowedAttrs = ["href", "title"];
        currentAttrs = Object.values(node.attributes).reduce((o, a) => {
          return allowedAttrs.includes(a.name)
            ? { ...o, [a.name]: a.value }
            : { ...o };
        }, {});
        return a(currentAttrs)(...returnContent);
      case "B":
        return b(...returnContent);
      case "STRONG":
        return b(...returnContent);
      case "U":
        return u(...returnContent);
      case "EM":
        return em(...returnContent);
      case "BLOCKQUOTE":
        return blockQuote(...returnContent);
      case "OL":
        return ol(...returnContent);
      case "UL":
        return ul(...returnContent);
      case "LI":
        return li(returnContent);
      default:
        return doc(...returnContent);
    }
  },
  rgbToHex(rgbString) {
    // TODO - move to util file
    rgbString = rgbString
      .replace("rgb(", "")
      .replace(")", "")
      .replace(" ", "")
      .split(",");
    let r = parseInt(rgbString[0], 10).toString(16);
    let g = parseInt(rgbString[1], 10).toString(16);
    let b = parseInt(rgbString[2], 10).toString(16);
    r = r.length == 1 ? "0" + r : r;
    g = g.length == 1 ? "0" + g : g;
    b = b.length == 1 ? "0" + b : b;
    return "#" + r + g + b;
  },
  formatData(data) {
    let orgs = [];
    if (Array.isArray(data.resource)) {
      for (const org of data.resource) {
        orgs.push({
          id: org.id,
          url: org.url,
          name: org.name,
          avatar: org.avatarUrl,
        });
      }
    } else {
      orgs = [
        {
          id: data.id,
          url: data.url,
          name: data.name,
          avatar: data.avatarUrl,
        },
      ];
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      clientId: data.clientId,
      clientSecret: data.clientSecret,
      yattOauthTokenId: data.yattOauthTokenId,
      expiresAt: data.expiresAt,
      type: data.type,
      loggedInAt: data.loggedInAt,
      lastRefreshed: data.lastRefreshed,
      user: {
        id: data.profile.id,
        email: data.profile.email,
        name: data.profile.name,
        avatar: data.profile.avatar_url,
        locale: data.profile.locale,
        account_type: data.profile.account_type,
      },
      orgs: orgs,
      url: data.url,
    };
  },
};

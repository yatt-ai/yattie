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

export default {
  saveCredentials(credentials, data) {
    // TODO - can this be generalized and the key passed?
    let formattedData = this.formatData(data);

    if (!credentials) {
      credentials = {};
    }

    if (credentials.jira && credentials.jira.length > 0) {
      let matched = false;
      for (const [jiraIndex, credential] of Object.entries(credentials.jira)) {
        if (credential.user.id === formattedData.user.id) {
          credentials.jira[jiraIndex] = formattedData;
          matched = true;
        }
      }
      if (!matched) {
        credentials.jira.push(formattedData);
      }
    } else {
      credentials.jira = [formattedData];
    }

    window.ipc.invoke(IPC_HANDLERS.DATABASE, {
      func: IPC_FUNCTIONS.UPDATE_CREDENTIALS,
      data: credentials,
    });

    return credentials;
  },
  htmlToADF(type, node) {
    // CTODO - move to OSS package
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
    // CTODO - move to util file
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
          id: data.resource.id,
          url: data.resource.url,
          name: data.resource.name,
          avatar: data.resource.avatarUrl,
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
        id: data.profile.account_id,
        email: data.profile.email,
        name: data.profile.name,
        avatar: data.profile.picture,
        locale: data.profile.locale,
        account_type: data.profile.account_type,
        verified: data.profile.email_verified,
      },
      orgs: orgs,
      url: data.url,
    };
  },
};

import Vue from "vue";
import VueRouter from "vue-router";

import HomeView from "../views/HomeView.vue";
import MainView from "../views/MainView.vue";
import AddSession from "../views/AddSession.vue";
import EditSession from "../views/EditSession.vue";
import ResultView from "../views/ResultView.vue";
import PrintView from "../views/PrintView.vue";
import MinimizeView from "../views/MinimizeView.vue";

import AuthenticationView from "../views/AuthenticationView.vue";
import Signup1Wrapper from "@/components/authentication/Signup1Wrapper";
import Signup2Wrapper from "@/components/authentication/Signup2Wrapper";
import Signup3Wrapper from "@/components/authentication/Signup3Wrapper";
import SigninWrapper from "@/components/authentication/SigninWrapper";

import SettingView from "../views/SettingView.vue";
import ConnectionsTab from "@/components/settings/ConnectionsTab.vue";
import GeneralTab from "@/components/settings/GeneralTab.vue";
import SupportTab from "@/components/settings/SupportTab.vue";
import TemplateTab from "@/components/settings/TemplateTab.vue";
import ConfigCheckListTab from "@/components/settings/ConfigCheckListTab.vue";
import ReportsTab from "@/components/settings/ReportsTab.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/authentication",
    component: AuthenticationView,
    children: [
      {
        path: "/",
        name: "signup1",
        component: Signup1Wrapper,
        props: true,
      },
      {
        path: "signup2",
        name: "signup2",
        component: Signup2Wrapper,
        props: true,
      },
      {
        path: "signup3",
        name: "signup3",
        component: Signup3Wrapper,
        props: true,
      },
      {
        path: "signin",
        name: "signin",
        component: SigninWrapper,
        props: true,
      },
    ],
  },
  {
    path: "/main",
    name: "main",
    component: MainView,
    children: [
      {
        path: "timeline",
      },
    ],
  },
  {
    path: "/settings",
    component: SettingView,
    children: [
      {
        path: "/",
        name: "general",
        component: GeneralTab,
        props: true,
      },
      {
        path: "connections",
        name: "connections",
        component: ConnectionsTab,
        props: true,
      },
      {
        path: "support",
        name: "support",
        component: SupportTab,
        props: true,
      },
      {
        path: "template",
        name: "template",
        component: TemplateTab,
        props: true,
      },
      {
        path: "checklist",
        name: "checklist",
        component: ConfigCheckListTab,
        props: true,
      },
      {
        path: "reports",
        name: "reports",
        component: ReportsTab,
        props: true,
      },
    ],
  },
  {
    path: "/addSession",
    name: "addSession",
    component: AddSession,
  },
  {
    path: "/editSession",
    name: "editSession",
    component: EditSession,
  },
  {
    path: "/result",
    name: "result",
    component: ResultView,
  },
  {
    path: "/print",
    name: "print",
    component: PrintView,
  },
  {
    path: "/minimize",
    name: "minimize",
    meta: { layout: "minimize" },
    component: MinimizeView,
  },
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

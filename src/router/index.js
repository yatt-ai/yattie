import Vue from "vue";
import VueRouter from "vue-router";

import HomeView from "../views/HomeView.vue";
import MainView from "../views/MainView.vue";
import AddSession from "../views/AddSession.vue";
import EditSession from "../views/EditSession.vue";
import ResultView from "../views/ResultView.vue";
import PrintView from "../views/PrintView.vue";

import SettingView from "../views/SettingView.vue";
import ConnectionsTab from "@/components/settings/ConnectionsTab.vue";
import GeneralTab from "@/components/settings/GeneralTab.vue";
import SupportTab from "@/components/settings/SupportTab.vue";
import TemplateTab from "@/components/settings/TemplateTab.vue";
import ConfigCheckListTab from "@/components/settings/ConfigCheckListTab.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
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
];

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? "hash" : "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

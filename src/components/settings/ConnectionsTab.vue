<template>
  <v-container class="content-wrapper">
    <v-row>
      <v-col cols="12" class="border-bottom pa-4">
        <p class="body-1">EXTERNAL CONNECTIONS</p>
        <a class="jira-link" href="#">Connect to a TestRail instance</a>
        <p></p>
        <a class="jira-link" href="#">Connect to a JIRA instance</a>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4">
        <div class="d-flex align-start">
          <div class="flex-grow-1">
            <p class="subtitle-1 mb-2">Use the app locally only</p>
            <p class="caption mb-0">
              Don't pull or push data to external sources
            </p>
          </div>
          <div class="flex-grow-0">
            <v-switch
              v-model="setting.useLocal"
              inset
              hide-details
              dense
              class="mt-0 pt-0"
            ></v-switch>
          </div>
        </div>
      </v-col>
      <v-col cols="12" class="border-bottom pa-4">
        <p class="subtitle-1 mb-4">YATT</p>
        <p class="body-1">Add Color</p>
        <v-text-field
          v-model="color"
          v-mask="mask"
          hide-details
          class="ma-0 pa-0"
          solo
        >
          <template v-slot:append>
            <v-menu
              v-model="menu"
              top
              nudge-bottom="105"
              nudge-left="16"
              :close-on-content-click="false"
            >
              <template v-slot:activator="{ on }">
                <div :style="swatchStyle" v-on="on" />
              </template>
              <v-card>
                <v-card-text class="pa-0">
                  <v-color-picker v-model="color" flat />
                </v-card-text>
              </v-card>
            </v-menu>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="12" class="pa-4">
        <p class="body-1">Current Organizations</p>
        <div class="d-flex flex-column" style="row-gap: 5px">
          <div class="d-flex align-center">
            <v-text-field
              placeholder="Search"
              outlined
              dense
              value="Organization name 1"
              hide-details="true"
            ></v-text-field>
            <v-btn icon color="primary" class="ml-2">
              <img :src="require('../../assets/icon/pencil-white.svg')" />
            </v-btn>
            <v-btn icon color="primary">
              <img :src="require('../../assets/icon/trash.svg')" />
            </v-btn>
          </div>
          <div class="d-flex align-center">
            <v-text-field
              placeholder="Search"
              outlined
              dense
              value="Organization name 1"
              hide-details="true"
            ></v-text-field>
            <v-btn icon color="primary" class="ml-2">
              <img :src="require('../../assets/icon/pencil-white.svg')" />
            </v-btn>
            <v-btn icon color="primary">
              <img :src="require('../../assets/icon/trash.svg')" />
            </v-btn>
          </div>
          <div>
            <v-btn plain color="primary" class="pa-0 add-btn">
              Add another organization
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "ConnectionsTab",
  components: {},
  props: {
    config: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    config: function (newValue) {
      this.setting = newValue;
    },
  },
  data() {
    return {
      setting: this.config,
      row: null,
      color: "#1976D2FF",
      mask: "!#XXXXXXXX",
      menu: false,
    };
  },
  computed: {
    swatchStyle() {
      const { color, menu } = this;
      return {
        backgroundColor: color,
        cursor: "pointer",
        height: "30px",
        width: "30px",
        borderRadius: menu ? "50%" : "4px",
        transition: "border-radius 200ms ease-in-out",
      };
    },
  },
  methods: {},
};
</script>
<style scoped>
.content-wrapper {
  height: 100vh;
  width: 100%;
  overflow-y: auto;
}
.body-1 {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 12px !important;
  line-height: 16px !important;
  letter-spacing: 0.05em !important;
  text-transform: uppercase !important;
  color: #6b7280 !important;
}
.subtitle-1 {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  line-height: 20px !important;
  color: #111827 !important;
}
.caption {
  font-style: normal !important;
  font-weight: 500 !important;
  font-size: 13px !important;
  line-height: 16px !important;
  color: #6b7280;
}
.jira-link {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: #6d28d9;
  text-decoration: none;
}
.border-bottom {
  border-bottom: 1px solid #e5e7eb;
}
</style>

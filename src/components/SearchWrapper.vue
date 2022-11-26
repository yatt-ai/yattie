<template>
  <v-container class="search-wrapper">
    <v-row>
      <v-col cols="12">
        <v-text-field
          placeholder="Search"
          outlined
          dense
          v-model="search"
          hide-details="true"
          @input="handleSearch"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "SearchWrapper",
  components: {},
  computed: {},
  data() {
    return {
      search: "",
    };
  },
  methods: {
    handleSearch(val) {
      this.$root.$emit("submit-search", val);
    },
  },
};
</script>
<style scoped>
.search-wrapper {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

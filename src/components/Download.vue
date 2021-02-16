<i18n src="../common/locales.json"></i18n>

<template>
  <div>
    <b-dropdown id="dropdown-form" text="Dropdown with form" ref="dropdown" class="m-2">
      <b-dropdown-form>
        <b-form-group label="Формат" label-for="dropdown-form-email" @submit.stop.prevent>
          <b-form-input
            id="dropdown-form-email"
            size="sm"
            placeholder="email@example.com"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Password" label-for="dropdown-form-password">
          <b-form-input
            id="dropdown-form-password"
            type="password"
            size="sm"
            placeholder="Password"
          ></b-form-input>
        </b-form-group>

        <b-form-checkbox class="mb-3">Remember me</b-form-checkbox>
        <b-button variant="primary" size="sm" @click="onClick">Sign In</b-button>
      </b-dropdown-form>
    </b-dropdown>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      fileList: [] as Array<File>,
    };
  },
  watch: {
    fileList: function (newFileList: Array<File>) {
      newFileList.forEach((file: File) => this.$store.commit("setFile", file));
      (this.$refs["form-file"] as any).reset();
    },
  },
  computed: {
    globalFileList: function () {
      return this.$store.state.fileList;
    },
  },
});
</script>
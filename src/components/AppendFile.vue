<i18n src="../common/locales.json"></i18n>

<template>
  <b-form @submit.stop.prevent class="mh-100 d-flex flex-column">
    <b-form-file
      v-model="fileList"
      :placeholder="$t('helper.tooltip.uploadfile.placeholder')"
      :drop-placeholder="$t('helper.tooltip.uploadfile.dropplaceholder')"
      accept="image/*"
      multiple
      ref="form-file"
      class="text-left"
      v-b-tooltip
      :title="$t('helper.tooltip.uploadfile.description')"
    ></b-form-file>
    <b-list-group class="overflow-auto">
      <b-list-group-item
        v-for="file in globalFileList"
        v-bind:key="file.symbolIndex"
        action
        v-on:click="$store.commit('showFile', file.symbolIndex)"
        class="d-flex justify-content-between align-items-center"
        >{{ file.name }}
        <b-button size="sm"><b-icon icon="trash-fill" aria-hidden="true" v-on:click.stop="$store.commit('deleteFile', file.symbolIndex)"></b-icon></b-button>
      </b-list-group-item>
    </b-list-group>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
    };
  },
  watch: {
    fileList: function (newFileList) {
      newFileList.map((file) => this.$store.commit("setFile", file));
      this.$refs["form-file"].reset();
    },
  },
  computed: {
    globalFileList: function () {
      return this.$store.state.fileList;
    },
    globalUrlFileList: function () {
      return this.globalFileList.map((file) => URL.createObjectURL(file));
    },
  }
};
</script>

<style>
</style>
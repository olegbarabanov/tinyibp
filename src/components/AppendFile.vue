<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="dark"
    header-text-variant="white"
    header="Файлы"
    class="h-100 text-center"
    border-variant="dark"
    body-bg-variant="light"
  >
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
        :browse-text="$t('helper.tooltip.uploadfile.browsebutton')"
      ></b-form-file>
      <b-list-group class="overflow-auto">
        <b-list-group-item
          v-for="(file, index) in globalFileList"
          v-bind:key="index"
          :active="$store.state.showFileIndex === index"
          v-on:click="$store.commit('showFile', index)"
          class="d-flex justify-content-between align-items-center p-1"
          >{{ index + 1 }} - {{ file.name }}
          <b-button
            aria-label="Close"
            v-on:click.stop="$store.commit('deleteFile', index)"
            class="close"
          >
            <span aria-hidden="true">&times;</span>
          </b-button>
        </b-list-group-item>
      </b-list-group>
    </b-form>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      fileList: [] as Array<File>,
    };
  },
  watch: {
    fileList: function(newFileList: Array<File>) {
      newFileList.forEach((file: File) => this.$store.commit('setFile', file));
      (this.$refs['form-file'] as any).reset();
    },
  },
  computed: {
    globalFileList: function() {
      return this.$store.state.fileList;
    },
  },
});
</script>

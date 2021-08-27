<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    class="h-100 text-center w-100"
    border-variant="dark"
    body-bg-variant="light"
    no-body
  >
    <b-card-header
      header-text-variant="white"
      header-bg-variant="dark"
      class="d-flex flex-row align-items-center justify-content-center p-1"
      style="min-height: 3rem"
    >
      <h5 class="my-0 mx-4">
        {{ $t('filelist.header.text') }}
      </h5>
      <label
        role="button"
        class="d-inline-flex my-0 mx-4 justify-content-center btn btn-secondary"
      >
        <b-icon icon="upload" />
        <b-form-file
          ref="form-file"
          v-model="fileList"
          v-b-tooltip
          :accept="acceptImageTypeList"
          multiple
          class="text-left invisible"
          style="width: 0; height: 0; transform: scale(0.05)"
        />
      </label>
    </b-card-header>
    <b-card-body v-if="globalFileList.length > 0" class="p-1">
      <b-form class="mh-100 d-flex flex-column" @submit.stop.prevent>
        <b-list-group class="overflow-auto">
          <b-list-group-item
            v-for="(file, index) in globalFileList"
            :key="index"
            :active="$store.state.showFileIndex === index"
            variant="light"
            class="d-flex justify-content-between align-items-center p-1"
            @click="$store.commit('showFile', index)"
          >
            <span class="text-truncate">{{ index + 1 }} - {{ file.name }}</span>
            <b-button
              aria-label="Close"
              class="close"
              @click.stop="$store.dispatch('deleteFile', index)"
            >
              <span aria-hidden="true">&times;</span>
            </b-button>
          </b-list-group-item>
        </b-list-group>
      </b-form>
    </b-card-body>

    <b-card-body v-else class="p-1">
      <div class="d-flex align-items-center justify-content-center h-100">
        <p>
          {{ $t('filelist.notice.emptylist') }}
        </p>
      </div>
    </b-card-body>
  </b-card>
</template>

<script lang="ts">
import {supportTypes} from '@/image-processor';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      fileList: [] as Array<File>,
    };
  },
  computed: {
    globalFileList: function() {
      return this.$store.state.fileList;
    },
    acceptImageTypeList() {
      return Array.from(supportTypes, type => type[0]).join(',');
    },
  },
  watch: {
    fileList: function(newFileList: Array<File>) {
      newFileList.forEach((file: File) => this.$store.commit('setFile', file));
      (this.$refs['form-file'] as any).reset();
    },
  },
});
</script>

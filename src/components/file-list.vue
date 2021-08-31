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

      <b-dropdown block class="d-inline-flex mx-4" no-caret>
        <template #button-content>
          <b-icon icon="plus-circle" />
        </template>
        <b-dropdown-item @click="getImageFromFilePicker()">
          {{ $t('filelist.upload.from-device') }}
        </b-dropdown-item>
        <b-dropdown-item @click="getImageFromClipboard()">
          {{ $t('filelist.upload.from-clipboard') }}
        </b-dropdown-item>
      </b-dropdown>
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
import {SupportMimesTypes, supportTypes} from '@/image-processor';
import Vue from 'vue';

export default Vue.extend({
  computed: {
    globalFileList: function() {
      return this.$store.state.fileList;
    },
    acceptImageTypeList() {
      return Array.from(supportTypes, type => type[0]).join(',');
    },
  },
  methods: {
    getImageFromFilePicker: async function() {
      const filePickerOptions = {
        types: [
          {
            description: this.$tc('filelist.filepicker.description'),
            accept: Object.fromEntries(
              Array.from(supportTypes, value => [value[0], '.' + value[1]])
            ),
          },
        ],
        excludeAcceptAllOption: true,
        multiple: true,
      };
      let fileHandle;
      try {
        [fileHandle] = await window.showOpenFilePicker(filePickerOptions);
      } catch (e) {
        if (!(e instanceof DOMException)) throw e; // capture AbortError
      }
      if (fileHandle) {
        const fileData = await fileHandle.getFile();
        this.$store.commit('setFile', fileData);
      }
    },
    getImageFromClipboard: async function() {
      const permission = await navigator.permissions.query({
        name: 'clipboard-read' as PermissionName, //trouble with TS >= 4.4.2
      });
      if (permission.state === 'denied') {
        this.$bvToast.toast(
          this.$tc('filelist.notice.forbidden-clipboard.text'),
          {
            title: this.$tc('filelist.notice.forbidden-clipboard.title'),
            variant: 'warning',
          }
        );
        return;
      }
      const data = await navigator.clipboard.read();
      const allowImageClipboardExtension = 'png';
      const allowImageType = SupportMimesTypes[allowImageClipboardExtension];

      for (let i = 0; i < data.length; i++) {
        if (!data[i].types.includes(allowImageType)) {
          this.$bvToast.toast(
            this.$tc('filelist.notice.incompatible-clipboard-data.text'),
            {
              title: this.$tc(
                'filelist.notice.incompatible-clipboard-data.title'
              ),
              variant: 'warning',
            }
          );
          continue;
        }
        const blob = await data[i].getType(allowImageType);
        const file = new File(
          [blob],
          this.$tc('filelist.clipboard.default-filename') +
            '_' +
            Date.now() +
            '.' +
            allowImageClipboardExtension,
          {
            type: blob.type,
          }
        );
        this.$store.commit('setFile', file);
      }
    },
  },
});
</script>

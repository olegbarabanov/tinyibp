<i18n src="../common/locales.json"></i18n>

<template>
  <div class="card h-100 text-center w-100 border-dark">
    <div
      class="card-header d-flex flex-row align-items-center justify-content-center p-1 bg-dark text-white"
      style="min-height: 3rem;"
    >
      <h5 class="my-0 mx-4">
        {{ $t('filelist.header.text') }}
      </h5>
      <div class="dropdown d-inline-flex mx-4">
        <button
          type="button"
          class="btn dropdown-toggle btn-secondary btn-block dropdown-toggle-no-caret"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-plus-circle" />
        </button>
        <ul tabindex="-1" class="dropdown-menu">
          <li @click="getImageFromFilePicker()">
            <a href="#" target="_self" class="dropdown-item">
              {{ $t('filelist.upload.from-device') }}
            </a>
          </li>
          <li @click="getImageFromClipboard()">
            <a href="#" target="_self" class="dropdown-item">
              {{ $t('filelist.upload.from-clipboard') }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="globalFileList.length > 0" class="card-body p-1">
      <form class="mh-100 d-flex flex-column">
        <div class="list-group overflow-auto">
          <div
            v-for="(file, index) in globalFileList"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center p-1 list-group-item-light"
            :active="$store.state.showFileIndex === index"
            @click="$store.commit('showFile', index)"
          >
            <span class="text-truncate">{{ index + 1 }} - {{ file.name }}</span
            ><button
              aria-label="Close"
              type="button"
              class="btn close btn-secondary"
              @click.stop="$store.dispatch('deleteFile', index)"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      </form>
    </div>
    <div v-else class="card-body p-1">
      <div class="d-flex align-items-center justify-content-center h-100">
        <p>
          {{ $t('filelist.notice.emptylist') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {SupportMimesTypes, supportTypes} from '@/image-processor';
import Vue from 'vue';

export default Vue.extend({
  computed: {
    globalFileList: function() {
      return this.$store.state.fileList;
    },
  },
  methods: {
    getImageFromFilePicker: async function() {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = Array.from(supportTypes, type => type[0]).join(',');
      input.onchange = () => {
        if (!input.files) return;
        for (const file of input.files) {
          if (supportTypes.has(file.type as SupportMimesTypes)) {
            this.$store.commit('setFile', file);
          }
        }
      };
      input.click();
    },
    getImageFromClipboard: async function() {
      const permission = await navigator.permissions.query({
        name: 'clipboard-read' as PermissionName, //trouble with TS >= 4.4.2
      });
      if (permission.state === 'denied') {
        // this.$bvToast.toast(
        //   this.$tc('filelist.notice.forbidden-clipboard.text'),
        //   {
        //     title: this.$tc('filelist.notice.forbidden-clipboard.title'),
        //     variant: 'warning',
        //   }
        // );
        return;
      }
      const data = await navigator.clipboard.read();
      const allowImageClipboardExtension = 'png';
      const allowImageType = SupportMimesTypes[allowImageClipboardExtension];

      for (let i = 0; i < data.length; i++) {
        if (!data[i].types.includes(allowImageType)) {
          // this.$bvToast.toast(
          //   this.$tc('filelist.notice.incompatible-clipboard-data.text'),
          //   {
          //     title: this.$tc(
          //       'filelist.notice.incompatible-clipboard-data.title'
          //     ),
          //     variant: 'warning',
          //   }
          // );
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

<i18n src="../common/locales.json"></i18n>

<template>
  <div class="card h-100 text-center w-100 border-dark">
    <div
      class="card-header d-flex flex-row align-items-center justify-content-center p-1 bg-dark text-white"
      style="min-height: 3rem;"
    >
      <h5 class="my-0 mx-4">
        {{ t('filelist.header.text') }}
      </h5>
      <div class="dropdown d-inline-flex mx-4">
        <button
          type="button"
          class="btn btn-secondary btn-block"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-plus-circle" />
        </button>
        <ul tabindex="-1" class="dropdown-menu">
          <li @click="getImageFromFilePicker">
            <a href="#" target="_self" class="dropdown-item">{{
              t('filelist.upload.from-device')
            }}</a>
          </li>
          <li @click="getImageFromClipboard">
            <a href="#" target="_self" class="dropdown-item">{{
              t('filelist.upload.from-clipboard')
            }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="fileList.length > 0" class="card-body p-1">
      <form class="mh-100 d-flex flex-column">
        <div class="list-group overflow-auto">
          <div
            v-for="(file, index) in fileList"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center p-1 list-group-item-light"
            :active="store.state.showFileIndex === index"
            @click="store.commit('showFile', index)"
          >
            <span class="text-truncate">{{ index + 1 }} - {{ file.name }}</span>
            <button
              aria-label="Close"
              type="button"
              class="btn close btn-secondary"
              @click.stop="store.dispatch('deleteFile', index)"
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        </div>
      </form>
    </div>
    <div v-else class="card-body p-1">
      <div class="d-flex align-items-center justify-content-center h-100">
        <p>{{ t('filelist.notice.emptylist') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {SupportMimesTypes, supportTypes} from '@/image-processor';
import {computed, defineComponent, inject, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import {useStore} from '@/store';
import {Toast} from 'bootstrap';

export default defineComponent({
  setup() {
    const {t, availableLocales, locale} = useI18n({useScope: 'global'});
    const store = useStore();
    const toastForbiddenClipboard = ref<HTMLElement>();
    const showToast = inject('showToast') as any;
    const fileList = computed(() => store.state.fileList);
    const getImageFromFilePicker = async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = Array.from(supportTypes, type => type[0]).join(',');
      input.onchange = () => {
        if (!input.files) return;
        for (const file of input.files) {
          if (supportTypes.has(file.type as SupportMimesTypes)) {
            store.commit('setFile', file);
          }
        }
      };
      input.click();
    };

    const getImageFromClipboard = async () => {
      const permission = await navigator.permissions.query({
        name: 'clipboard-read' as PermissionName, //trouble with TS >= 4.4.2
      });
      if (permission.state === 'denied') {
        // bc.Toast.getInstance(toastForbiddenClipboard.value)?.show();
        // this.$bvToast.toast(
        //   this.$tc('filelist.notice.forbidden-clipboard.text'),
        //   {
        //     title: this.$tc('filelist.notice.forbidden-clipboard.title'),
        //     variant: 'warning',
        //   }
        // );
        return;
      }
      if (toastForbiddenClipboard.value) {
        const toast = new Toast(toastForbiddenClipboard.value);
        console.log(2, toast, toastForbiddenClipboard.value);
        toast.show();
      }
      showToast(
        t('filelist.notice.forbidden-clipboard.title'),
        t('filelist.notice.incompatible-clipboard-data.text')
      );
      // bc.Toast.getInstance(toastForbiddenClipboard.value)?.show();
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
          t('filelist.clipboard.default-filename') +
            '_' +
            Date.now() +
            '.' +
            allowImageClipboardExtension,
          {
            type: blob.type,
          }
        );
        store.commit('setFile', file);
      }
    };

    return {
      t,
      availableLocales,
      store,
      locale,
      fileList,
      getImageFromFilePicker,
      getImageFromClipboard,
      toastForbiddenClipboard,
    };
  },
});
</script>

<i18n src="../common/locales.json"></i18n>

<template>
  <div
    class="card h-100 text-center rounded-0 p-1 flex-row justify-content-between bg-dark border-dark text-white"
  >
    <div class="dropdown b-dropdown mx-md-4 dropup btn-group">
      <button
        type="button"
        class="btn dropdown-toggle btn-secondary"
        data-bs-toggle="dropdown"
      >
        {{ t('download.settings.label') }}
      </button>
      <ul tabindex="-1" class="dropdown-menu">
        <li role="presentation" style="min-width: 250px;">
          <form tabindex="-1" class="px-3">
            <div class="input-group my-1 input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  {{ t('download.settings.form.type.label') }}
                </div>
              </div>
              <select
                v-model="selectedType"
                class="text-nowrap custom-select form-select"
              >
                <option
                  v-for="[key, value] in supportTypes"
                  :key="key"
                  :value="key"
                >
                  {{ value }}
                </option>
              </select>
            </div>
            <div class="input-group my-1 input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  {{ t('download.settings.form.quality.label') }}
                </div>
              </div>
              <input
                v-model="quality"
                type="number"
                min="1"
                max="100"
                step="1"
                class="form-control"
              />
            </div>
            <div class="input-group my-1 input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  {{ t('download.settings.form.pattern.label') }}
                </div>
              </div>
              <input
                v-model="nameTransformPattern"
                type="text"
                placeholder=""
                class="form-control"
              />
            </div>
          </form>
        </li>
      </ul>
    </div>
    <div class="dropdown b-dropdown mx-md-4 dropup">
      <button
        type="button"
        :disabled="disabledDownload"
        class="btn dropdown-toggle btn-secondary btn-block"
        data-bs-toggle="dropdown"
      >
        {{ t('download.download.label') }}
      </button>
      <ul tabindex="-1" class="dropdown-menu dropdown-menu-right">
        <li>
          <button type="button" class="dropdown-item" @click="downloadAll()">
            {{ t('download.download.all.label') }}
          </button>
        </li>
        <li>
          <button
            type="button"
            class="dropdown-item"
            @click="downloadAll('zip')"
          >
            {{ t('download.download.zip.label') }}
          </button>
        </li>
      </ul>
    </div>
  </div>

  <teleport to="#modal-container">
    <div
      :id="`modal-download-${componentID}`"
      ref="modalStatus"
      class="modal fade"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Downloads
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <p class="my-4">
              {{ t('download.modal.progress.text') }}
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import {computed, defineComponent, inject, ref} from 'vue';
import SequenceId from '@/utils/sequence-id';
import {useI18n} from 'vue-i18n';
import {useStore} from '@/store';
import {supportTypes} from '@/image-processor';
import {key as keyToast} from '@/toast';
import {Modal} from 'bootstrap';
export default defineComponent({
  setup() {
    const {t} = useI18n({useScope: 'global'});
    const store = useStore();

    const componentID = SequenceId.getNew();
    const busy = ref<boolean>(false);
    const modalStatus = ref<HTMLElement | null>(null);

    const showToast = inject(keyToast);

    const selectedType = computed({
      get: () => store.state.type,
      set: value => store.dispatch('setType', value),
    });

    const quality = computed({
      get: () => store.state.quality,
      set: value => store.dispatch('setQuality', value),
    });

    const nameTransformPattern = computed({
      get: () => store.state.nameTransformPattern,
      set: value => store.dispatch('setNameTransformPattern', value),
    });

    const disabledDownload = computed(() => store.state.fileList.length === 0);

    const downloadAll = async (method = 'common') => {
      if (!showToast) throw new Error('Toasts not injected in the component!');
      showToast({
        text: t('download.toast.createzip.text'),
        type: 'info',
        title: '',
        duration: 3000,
      });
      const element = modalStatus.value;
      if (!element)
        throw new Error('Template problem: Modal HTMLElement is undefined');

      const myModal = new Modal(element, {
        keyboard: false,
      });
      try {
        myModal.show();
        await store.dispatch('downloadAll', method);
        showToast({
          text: t('download.toast.successzip.text'),
          type: 'success',
          title: '',
          duration: 3000,
        });
      } catch (error) {
        console.warn(error);
        showToast({
          text: t('download.toast.errorzip.text'),
          type: 'danger',
          title: '',
          duration: 3000,
        });
      } finally {
        setTimeout(() => myModal.hide(), 1500);
      }
    };

    return {
      t,
      supportTypes,
      selectedType,
      componentID,
      busy,
      quality,
      nameTransformPattern,
      disabledDownload,
      downloadAll,
      modalStatus,
    };
  },
});
</script>

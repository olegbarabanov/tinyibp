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
        {{ $t('download.settings.label') }}
      </button>
      <ul tabindex="-1" class="dropdown-menu">
        <li role="presentation" style="min-width: 250px;">
          <form tabindex="-1" class="b-dropdown-form px-3">
            <div role="group" class="input-group my-1 input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  {{ $t('download.settings.form.type.label') }}
                </div>
              </div>
              <select
                v-model="selectedType"
                class="text-nowrap custom-select form-select"
              >
                <option
                  v-for="type in supportTypes"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.text }}
                </option>
              </select>
            </div>
            <div class="input-group my-1 input-group-sm">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  {{ $t('download.settings.form.quality.label') }}
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
                  {{ $t('download.settings.form.pattern.label') }}
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
        {{ $t('download.download.label') }}
      </button>
      <ul role="menu" tabindex="-1" class="dropdown-menu dropdown-menu-right">
        <li role="presentation">
          <button
            role="menuitem"
            type="button"
            class="dropdown-item"
            @click="downloadAll()"
          >
            {{ $t('download.download.all.label') }}
          </button>
        </li>
        <li role="presentation">
          <button
            role="menuitem"
            type="button"
            class="dropdown-item"
            @click="downloadAll('zip')"
          >
            {{ $t('download.download.zip.label') }}
          </button>
        </li>
      </ul>
    </div>
  </div>

  <!--
    <b-modal
      :id="`modal-download-${componentID}`"
      centered
      :title="$t('download.modal.progress.title')"
      no-close-on-esc
      no-close-on-backdrop
    >
      <p class="my-4">
        {{ $t('download.modal.progress.text') }}
      </p>
    </b-modal>
  </b-card> -->
</template>

<script lang="ts">
import {supportTypes} from '@/image-processor';
import SequenceId from '@/utils/sequence-id';
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      busy: false,
      componentID: SequenceId.getNew(),
      supportTypes: [
        {value: null, text: 'auto'},
        ...Array.from(supportTypes, type => {
          return {value: type[0], text: type[1] as string};
        }),
      ],
    };
  },
  computed: {
    selectedType: {
      get() {
        return this.$store.state.type;
      },
      set(value) {
        this.$store.dispatch('setType', value);
      },
    },
    quality: {
      get() {
        return this.$store.state.quality;
      },
      set(value) {
        this.$store.dispatch('setQuality', value);
      },
    },
    nameTransformPattern: {
      get() {
        return this.$store.state.nameTransformPattern;
      },
      set(value) {
        this.$store.dispatch('setNameTransformPattern', value);
      },
    },
    disabledDownload() {
      return this.$store.state.fileList.length === 0;
    },
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    downloadAll: async function(method = 'common') {
      // this.$bvToast.toast(this.$tc('download.toast.createzip.text'), {
      //   variant: 'info',
      // });
      // const modalId = `modal-download-${this.componentID}`;
      // try {
      //   this.busy = true;
      //   this.$bvModal.show(modalId);
      //   await this.$store.dispatch('downloadAll', method);
      //   this.$bvToast.toast(this.$tc('download.toast.successzip.text'), {
      //     variant: 'success',
      //   });
      // } catch (error) {
      //   console.warn(error);
      //   this.$bvToast.toast(this.$tc('download.toast.errorzip.text'), {
      //     variant: 'danger',
      //   });
      // } finally {
      //   this.busy = false;
      //   this.$bvModal.hide(modalId);
      // }
    },
  },
});
</script>

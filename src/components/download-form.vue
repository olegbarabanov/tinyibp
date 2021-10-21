<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="dark"
    text-variant="white"
    class="h-100 text-center rounded-0 p-1 d-flex flex-row justify-content-between"
    border-variant="dark"
    no-body
  >
    <b-dropdown :text="$t('download.settings.label')" dropup class="mx-md-4">
      <b-dropdown-form style="min-width: 250px;">
        <b-input-group
          size="sm"
          :prepend="$t('download.settings.form.type.label')"
          class="m-1"
        >
          <b-form-select
            v-model="selectedType"
            :options="supportTypes"
            class="text-nowrap"
          />
        </b-input-group>
        <b-input-group
          size="sm"
          :prepend="$t('download.settings.form.quality.label')"
          class="m-1"
        >
          <b-form-input
            v-model="quality"
            type="number"
            min="1"
            max="100"
            step="1"
          />
        </b-input-group>
        <b-input-group
          size="sm"
          :prepend="$t('download.settings.form.pattern.label')"
          class="m-1"
        >
          <b-form-input v-model="nameTransformPattern" placeholder="" trim />
        </b-input-group>
      </b-dropdown-form>
    </b-dropdown>

    <b-dropdown
      right
      variant="secondary"
      block
      :text="$t('download.download.label')"
      class="mx-md-4"
      dropup
      :disabled="disabledDownload"
    >
      <b-dropdown-item-button @click="downloadAll()">
        {{ $t('download.download.all.label') }}
      </b-dropdown-item-button>
      <b-dropdown-item-button @click="downloadAll('zip')">
        {{ $t('download.download.zip.label') }}
      </b-dropdown-item-button>
    </b-dropdown>

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
  </b-card>
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

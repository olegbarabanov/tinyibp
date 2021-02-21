<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="dark"
    text-variant="white"
    class="h-100 text-center rounded-0 p-1"
    border-variant="dark"
    no-body
  >
    <b-form
      @submit.stop.prevent
      class="mh-100 d-flex flex-row align-content-center justify-content-center align-items-center"
    >
      <b-input-group size="sm" prepend="Тип" class="mx-4">
        <b-form-select
          v-model="selectedType"
          :options="supportTypes"
          class="text-nowrap"
        ></b-form-select>
      </b-input-group>

      <b-input-group size="sm" prepend="Качество" class="mx-4">
        <b-form-input
          id="range-2"
          v-model="quality"
          type="number"
          min="1"
          max="100"
          step="1"
        ></b-form-input>
      </b-input-group>
      <b-input-group size="sm" prepend="Шаблон имени" class="mx-4">
        <b-form-input
          id="input-live"
          v-model="nameTransformPattern"
          placeholder="Enter your pattern"
          trim
        ></b-form-input>
      </b-input-group>
      <b-dropdown block :text="$t('button.event.download')" class="mx-4">
        <b-dropdown-item v-on:click="downloadAll()"
          >Скачать все файлы</b-dropdown-item
        >
        <b-dropdown-item v-on:click="downloadAll('zip')"
          >Скачать как ZIP</b-dropdown-item
        >
      </b-dropdown>
    </b-form>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {supportTypes} from '../filters/ImageProcessor';

export default Vue.extend({
  data() {
    console.log(this);
    return {
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
  },
  methods: {
    downloadAll: async function(method: string = 'common') {
      this.$bvToast.toast(
        'Создаем ZIP архив... Это может занять некоторое время.',
        {variant: 'info'}
      );
      try {
        await this.$store.dispatch('downloadAll', method);
        this.$bvToast.toast('Архив изображений готов !', {variant: 'success'});
      } catch (error) {
        console.log(error);
        this.$bvToast.toast(
          'К сожалению при сохранении произошла ошибка. Попробуйте другой способ сохранения файлов',
          {variant: 'danger'}
        );
      }
    },
  },
});
</script>

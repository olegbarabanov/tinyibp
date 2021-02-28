<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="dark"
    text-variant="white"
    class="h-100 text-center rounded-0 p-1 d-flex flex-row justify-content-between"
    border-variant="dark"
    no-body
  >
    <b-dropdown text="Настройки файлов" dropup class="mx-md-4">
      <b-dropdown-form style="min-width: 250px;">
        <b-input-group size="sm" prepend="Тип" class="m-1">
          <b-form-select
            v-model="selectedType"
            :options="supportTypes"
            class="text-nowrap"
          />
        </b-input-group>
        <b-input-group size="sm" prepend="Качество" class="m-1">
          <b-form-input
            v-model="quality"
            type="number"
            min="1"
            max="100"
            step="1"
          />
        </b-input-group>
        <b-input-group size="sm" prepend="Шаблон имени" class="m-1">
          <b-form-input
            v-model="nameTransformPattern"
            placeholder="Enter your pattern"
            trim
          />
        </b-input-group>
      </b-dropdown-form>
    </b-dropdown>

    <b-dropdown
      right
      variant="secondary"
      block
      :text="$t('button.event.download')"
      class="mx-md-4"
    >
      <b-dropdown-item-button @click="downloadAll()">
        Скачать все файлы
      </b-dropdown-item-button>
      <b-dropdown-item-button @click="downloadAll('zip')">
        Скачать как ZIP
      </b-dropdown-item-button>
    </b-dropdown>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {supportTypes} from '../filters/ImageProcessor';

export default Vue.extend({
  data() {
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
    downloadAll: async function(method = 'common') {
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

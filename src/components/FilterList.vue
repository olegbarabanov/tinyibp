<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="dark"
    header-text-variant="white"
    header="Фильтры"
    class="h-100 text-center"
    border-variant="dark"
    body-bg-variant="light"
  >
    <div class="d-flex flex-column mh-100">
      <b-dropdown block :text="$t('button.addeventhandler')" class="m-2">
        <b-dropdown-item
          v-for="filter in registeredFilters"
          v-bind:key="filter"
          v-on:click="initFilter(filter)"
          >{{ $t(`filter.${filter}.name`) }}</b-dropdown-item
        >
      </b-dropdown>

      <draggable
        tag="div"
        :list="filterMaps"
        class="list-group overflow-auto"
        handle=".handle"
      >
        <b-card no-body v-for="(filter, index) in filterMaps" :key="index">
          <b-card-header
            header-tag="header"
            class="handle"
            header-bg-variant="gradient-dark"
            :title="$t('helper.tooltip.draggable')"
          >
            <b-row align-v="center" class="flex-nowrap">
              <b-col cols="3">
                <b-button
                  class="m-1 p-1"
                  v-b-tooltip
                  size="sm"
                  :title="$t('helper.tooltip.draggable')"
                  >{{ index + 1 }}
                </b-button></b-col
              >
              <b-col cols="6">{{ $t(`filter.${filter.name}.name`) }}</b-col>
              <b-col cols="3">
                <b-button
                  aria-label="Close"
                  v-on:click="$store.commit('removeFilter', index)"
                  class="close"
                >
                  <span aria-hidden="true">&times;</span>
                </b-button>
              </b-col>
            </b-row>
          </b-card-header>
          <b-card-body>
            <component
              v-bind:settings="filter"
              v-bind:is="
                filter.name.charAt(0).toUpperCase() +
                  filter.name.slice(1) +
                  'Filter'
              "
            ></component>
          </b-card-body>
        </b-card>
      </draggable>
      <b-dropdown block :text="$t('button.event.download')" class="m-2">
        <b-dropdown-item v-on:click="$store.dispatch('downloadImages')"
          >Скачать все файлы</b-dropdown-item
        >
        <b-dropdown-item v-on:click="$store.dispatch('downloadImages', 'zip')"
          >Скачать как ZIP</b-dropdown-item
        >
      </b-dropdown>
    </div>
  </b-card>
</template>

<script lang="ts">
import Vue from 'vue';
import {mapState, mapActions} from 'vuex';
import draggable from 'vuedraggable';

export default Vue.extend({
  components: {
    draggable,
  },
  methods: {
    ...mapActions(['initFilter']),
  },
  computed: {
    ...mapState(['registeredFilters']),
    filterMaps: {
      get() {
        return this.$store.state.filterMaps;
      },
      set() {
        this.$store.dispatch('setFilter');
      },
    },
    supportLangs() {
      return Object.keys(this.$i18n.messages);
    },
  },
  data: function() {
    return {
      filters: [],
    };
  },
});
</script>

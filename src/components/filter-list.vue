<i18n global src="../common/locales.json"></i18n>

<template>
  <div class="card h-100 text-center w-100 border-dark">
    <div
      class="card-header d-flex flex-row align-items-center justify-content-center p-1 bg-dark text-white"
      style="min-height: 3rem;"
    >
      <h5 class="my-0 mx-4">
        {{ t('filterlist.header.text') }}
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
          <li
            v-for="filter in registeredFilters"
            :key="filter"
            @click="initFilter(filter)"
          >
            <a href="#" target="_self" class="dropdown-item">
              {{ t(`filterlist.filter.${filter}.name`) }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="filterMaps.length > 0" class="card-body p-1">
      <div class="d-flex flex-column mh-100">
        <div>
          <div class="list-group overflow-auto">
            <div
              v-for="(filter, index) in filterMaps"
              :key="index"
              class="card mb-1 border-secondary"
            >
              <header
                :title="t('filterlist.event.draggable.title')"
                class="card-header handle py-1 bg-secondary text-white"
                style="cursor: move;"
              >
                <div class="row flex-nowrap align-items-center">
                  <div class="col-3">
                    <span class="badge bg-light text-dark">
                      {{ index + 1 }}
                    </span>
                  </div>
                  <div class="col-6">
                    {{ t(`filterlist.filter.${filter.name}.name`) }}
                  </div>
                  <div class="col-3">
                    <button
                      type="button"
                      class="btn close btn-secondary"
                      @click="store.commit('removeFilter', index)"
                    >
                      <span>×</span>
                    </button>
                  </div>
                </div>
              </header>
              <div class="card-body">
                <component
                  :is="
                    filter.name.charAt(0).toUpperCase() +
                      filter.name.slice(1) +
                      'Filter'
                  "
                  v-model="filterMaps[index]"
                />
                <!-- <component
                :is="
                  filter.name.charAt(0).toUpperCase() +
                    filter.name.slice(1) +
                    'Filter'
                "
                v-bind.sync="filterMaps[index]"
              /> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card-body">
      <div class="d-flex align-items-center justify-content-center h-100">
        <p>
          {{ t('filterlist.notice.emptylist') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {useStore} from '@/store';
import {computed, defineComponent} from 'vue';
import {useI18n} from 'vue-i18n';
import Draggable from 'vuedraggable';
import OpacityFilter from './opacity-filter.vue';
import BlurFilter from './blur-filter.vue';
import GrayscaleFilter from './grayscale-filter.vue';
import ContrastFilter from './contrast-filter.vue';
import RotateFilter from './rotate-filter.vue';
import SaturateFilter from './saturate-filter.vue';
import CropFilter from './crop-filter.vue';
import ColorReplacementFilter from './color-replacement-filter.vue';
import ResizeFilter from './resize-filter.vue';
import OverlayFilter from './overlay-filter.vue';

export default defineComponent({
  components: {
    Draggable,
    OpacityFilter,
    BlurFilter,
    GrayscaleFilter,
    ContrastFilter,
    RotateFilter,
    SaturateFilter,
    CropFilter,
    ColorReplacementFilter,
    ResizeFilter,
    OverlayFilter,
  },
  setup() {
    const {t} = useI18n({useScope: 'global'});
    const store = useStore();
    const registeredFilters = computed(() => store.state.registeredFilters);

    const filterMaps = computed(() => store.state.filterMaps);
    const initFilter = (filter: any) => store.dispatch('initFilter', filter); //FIXME: check any !!!

    return {t, filterMaps, store, initFilter, registeredFilters};
  },
});

/*
import Vue from 'vue';
import {mapState, mapActions} from 'vuex';
import draggable from 'vuedraggable';

export default Vue.extend({
  components: {
    draggable,
  },
  data: function() {
    return {
      filters: [],
    };
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
  methods: {
    ...mapActions(['initFilter']),
  },
});
*/
</script>

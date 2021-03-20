<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    class="h-100 text-center w-100"
    border-variant="dark"
    body-bg-variant="light"
    no-body
  >
    <b-card-header
      header-bg-variant="dark"
      header-text-variant="white"
      class="d-flex flex-row align-items-center justify-content-center p-1"
      style="min-height:3rem"
    >
      <h5 class="my-0 mx-4">
        {{ $t('filterlist.header.text') }}
      </h5>
      <b-dropdown block class="d-inline-flex mx-4" no-caret>
        <template #button-content>
          <b-icon icon="plus-circle" />
        </template>
        <b-dropdown-item
          v-for="filter in registeredFilters"
          :key="filter"
          @click="initFilter(filter)"
        >
          {{ $t(`filterlist.filter.${filter}.name`) }}
        </b-dropdown-item>
      </b-dropdown>
    </b-card-header>

    <b-card-body class="p-1">
      <div class="d-flex flex-column mh-100">
        <draggable
          tag="div"
          :list="filterMaps"
          class="list-group overflow-auto"
          handle=".handle"
        >
          <b-card
            v-for="(filter, index) in filterMaps"
            :key="index"
            no-body
            border-variant="secondary"
            class="mb-1"
          >
            <b-card-header
              header-tag="header"
              class="handle py-1"
              header-bg-variant="secondary"
              header-text-variant="white"
              :title="$t('filterlist.event.draggable.title')"
              style="cursor: move;"
            >
              <b-row align-v="center" class="flex-nowrap">
                <b-col cols="3">
                  <b-badge variant="light">
                    {{ index + 1 }}
                  </b-badge>
                </b-col>
                <b-col cols="6">
                  {{ $t(`filterlist.filter.${filter.name}.name`) }}
                </b-col>
                <b-col cols="3">
                  <b-button
                    aria-label="Close"
                    class="close"
                    @click="$store.commit('removeFilter', index)"
                  >
                    <span aria-hidden="true">&times;</span>
                  </b-button>
                </b-col>
              </b-row>
            </b-card-header>
            <b-card-body>
              <component
                :is="
                  filter.name.charAt(0).toUpperCase() +
                    filter.name.slice(1) +
                    'Filter'
                "
                v-bind.sync="filterMaps[index]"
              />
            </b-card-body>
          </b-card>
        </draggable>
      </div>
    </b-card-body>
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
</script>

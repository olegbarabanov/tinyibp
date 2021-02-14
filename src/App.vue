<i18n src="./common/locales.json"></i18n>

<template>
  <div id="app">
    <b-container fluid class="vh-100 p-0 d-flex flex-column">
      <b-row no-gutters>
        <b-col>
          <b-navbar toggleable="lg" type="dark" variant="info">
            <b-navbar-brand href="#"
              >ImageBatch {{ $t("hello") }}</b-navbar-brand
            >

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown :text="$t('chooselang')" right>
                  <b-dropdown-item
                    v-for="lang in supportLangs"
                    :key="lang"
                    v-on:click="$store.commit('setlang', lang)"
                    class="text-uppercase"
                    >{{ lang }}</b-dropdown-item
                  >
                </b-nav-item-dropdown>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </b-col>
      </b-row>
      <b-row align-v="stretch" no-gutters class="flex-grow-1 overflow-hidden">
        <b-col md="3" class="mh-100">
          <append-file></append-file>
        </b-col>

        <b-col md="6" class="mh-100">
          <preview-canvas></preview-canvas>
        </b-col>

        <b-col md="3" class="mh-100">
          <div class="d-flex flex-column mh-100">
            <b-dropdown block :text="$t('button.addeventhandler')" class="m-2">
              <b-dropdown-item
                v-for="filter in registeredFilters"
                v-bind:key="filter"
                v-on:click="initFilter(filter)"
                >{{ $t(`filter.${filter.toLowerCase()}.name`) }}</b-dropdown-item
              >
            </b-dropdown>

            <draggable
              tag="div"
              :list="filterMaps"
              class="list-group overflow-auto"
              handle=".handle"
            >
              <b-card
                no-body
                v-for="(filter, index) in filterMaps"
                :key="index"
                
              >
                <b-card-header header-tag="header" class="p-1 handle" header-bg-variant="gradient-dark" :title="$t('helper.tooltip.draggable')">
                  <b-row align-v="center" class="flex-nowrap">
                    <b-col cols="3"
                      >
                      <b-button
                        class="m-1 p-1"
                        v-b-tooltip
                        size="sm"
                        :title="$t('helper.tooltip.draggable')"
                        >#{{ index + 1 }}
                      </b-button></b-col
                    >
                    <b-col cols="6">{{ $t(`filter.${filter.name.toLowerCase()}.name`) }}</b-col>
                    <b-col cols="3">
                      <b-button class="m-1" variant="light" size="sm" v-on:click="$store.commit('removeFilter', index)"
                        ><b-icon icon="trash-fill" aria-hidden="true"></b-icon
                      ></b-button>
                    </b-col>
                  </b-row>
                </b-card-header>
                <b-card-body>
                  <component
                    v-bind:settings="filter"
                    v-bind:is="filter.name"
                  ></component>
                </b-card-body>
              </b-card>
            </draggable>
            <b-dropdown block :text="$t('button.event.download')" class="m-2">
              <b-dropdown-item v-on:click="$store.dispatch('downloadImages')"
                >Скачать все файлы</b-dropdown-item
              >
              <b-dropdown-item
                v-on:click="$store.dispatch('downloadImages', 'zip')"
                >Скачать как ZIP</b-dropdown-item
              >
            </b-dropdown>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapActions } from "vuex";
import draggable from "vuedraggable";
import previewCanvas from "./components/PreviewCanvas.vue";
import appendFile from "./components/AppendFile.vue";

export default Vue.extend({
  name: "App",
  components: {
    draggable,
    previewCanvas,
    appendFile,
  },
  methods: {
    ...mapActions(["initFilter"]),
  },
  computed: {
    ...mapState(["registeredFilters"]),
    filterMaps: {
      get() {
        return this.$store.state.filterMaps;
      },
      set() {
        this.$store.dispatch("setFilter");
      },
    },
    supportLangs() {
      return Object.keys(this.$i18n.messages);
    },
  },
  data: function () {
    return {
      filters: [],
      handlers: [
        {
          name: "test",
          component: "component",
        },
      ],
    };
  }
})

/*
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {}
*/
</script>



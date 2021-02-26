<i18n src="./common/locales.json"></i18n>

<template>
  <div id="app">
    <b-container fluid class="p-0 d-flex flex-column">
      <b-row no-gutters>
        <b-col>
          <b-navbar sticky toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="#"
              ><span>TinyIBP (v0.1.1 - alpha)</span></b-navbar-brand
            >
            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav class="ml-auto">
                <b-nav-item-dropdown :text="$t('chooselang')" right>
                  <b-dropdown-item
                    v-for="lang in supportLangs"
                    :key="lang"
                    v-on:click="$store.commit('setLang', lang)"
                    class="text-uppercase"
                    >{{ lang }}</b-dropdown-item
                  >
                </b-nav-item-dropdown>
              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </b-col>
      </b-row>

      <b-row
        align-v="stretch"
        no-gutters
        class="flex-grow-1 overflow-hidden"
        v-if="$screen.md"
      >
        <b-col md="3" class="mh-100 p-1">
          <append-file></append-file>
        </b-col>

        <b-col md="6" class="mh-100 p-1">
          <preview-canvas></preview-canvas>
        </b-col>

        <b-col md="3" class="mh-100 p-1">
          <filter-list></filter-list>
        </b-col>
      </b-row>
      <b-row
        align-v="stretch"
        no-gutters
        class="flex-grow-1 overflow-hidden"
        v-else
      >
        <b-col cols="12" class="mh-100 p-1">
          <preview-canvas></preview-canvas>
        </b-col>
      </b-row>

      <b-row align-v="stretch" no-gutters>
        <b-col md="12">
          <download></download>
        </b-col>
      </b-row>
    </b-container>
    <div v-if="!$screen.md">
      <b-button
        v-b-toggle.sidebar-files-backdrop
        style="position: fixed; left: 0; top: 50%; z-index: 99;"
        >Файлы</b-button
      >

      <b-sidebar
        id="sidebar-files-backdrop"
        backdrop
        bg-variant="transparent"
        body-class="d-flex"
        shadow
        no-header
        width="250px"
      >
        <append-file></append-file>
      </b-sidebar>

      <b-button
        v-b-toggle.sidebar-filters-backdrop
        style="position: fixed; right: 0; top: 50%; z-index: 99;"
        >Фильтры</b-button
      >

      <b-sidebar
        id="sidebar-filters-backdrop"
        backdrop
        bg-variant="transparent"
        body-class="d-flex"
        right
        shadow
        no-header
        width="250px"
      >
        <filter-list></filter-list>
      </b-sidebar>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import previewCanvas from './components/PreviewCanvas.vue';
import appendFile from './components/AppendFile.vue';
import filterList from './components/FilterList.vue';
import download from './components/Download.vue';

export default Vue.extend({
  name: 'App',
  components: {
    previewCanvas,
    appendFile,
    filterList,
    download,
  },
  computed: {
    supportLangs() {
      return Object.keys(this.$i18n.messages);
    },
  },
  data: function() {
    return {};
  },
});

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

<style>
:root {
  height: 100%;
}

body {
  height: 100%;
  display: flex;
  flex-flow: column;
}

#app {
  display: flex;
  flex: 1 1 auto;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".15"/></svg>');
  background-size: 2rem;
}
</style>

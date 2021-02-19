<i18n src="./common/locales.json"></i18n>

<template>
  <div id="app">
    <b-container fluid class="vh-100 p-0 d-flex flex-column">
      <b-row no-gutters>
        <b-col>
          <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="#"
              >ImageBatch {{ $t('hello') }} (version 0.0.1 -
              alpha)</b-navbar-brand
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
      <b-row align-v="stretch" no-gutters>
        <b-col md="12">
          <download></download>
        </b-col>
      </b-row>
    </b-container>
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

<style scoped>
#app {
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path d="M1 2V0h1v1H0v1z" fill-opacity=".15"/></svg>');
  background-size: 2rem;
}
</style>

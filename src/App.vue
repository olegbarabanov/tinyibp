<i18n global src="./common/locales.json"></i18n>

<template>
  <div id="app">
    <div class="p-0 d-flex flex-column container-fluid">
      <div class="row g-0">
        <div class="col">
          <nav
            class="navbar sticky-top navbar-dark bg-dark navbar-expand-lg px-3"
          >
            <a href="#" target="_self" class="navbar-brand"
              ><span>TinyIBP (v0.1.6)</span></a
            ><button
              type="button"
              class="navbar-toggler collapsed"
              style="overflow-anchor: none;"
            >
              <span class="navbar-toggler-icon" />
            </button>
            <div
              id="nav-collapse"
              class="navbar-collapse collapse"
              style="display: none;"
            >
              <ul class="navbar-nav ms-auto">
                <li class="nav-item b-nav-dropdown dropdown">
                  <a
                    href="#"
                    target="_self"
                    class="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                    ><span>{{ t('app.chooselang') }}</span></a
                  >
                  <ul tabindex="-1" class="dropdown-menu dropdown-menu-end">
                    <li class="text-uppercase">
                      <a
                        v-for="lang in availableLocales"
                        :key="lang"
                        href="#"
                        target="_self"
                        class="dropdown-item text-uppercase"
                        @click="$store.commit('setLang', lang)"
                      >
                        {{ lang }}
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </div>
      <div
        v-if="$screen.md"
        class="row flex-grow-1 overflow-hidden g-0 align-items-stretch"
      >
        <div class="col-md-3 mh-100 p-1">
          <file-list />
        </div>
        <div class="col-md-6 mh-100 p-1">
          <preview-canvas />
        </div>
        <div class="col-md-3 mh-100 p-1">
          <filter-list />
        </div>
      </div>
      <div
        v-else
        class="row flex-grow-1 overflow-hidden g-0 align-items-stretch"
      >
        <div class="col-12 mh-100 p-1">
          <preview-canvas />
        </div>
      </div>
      <div class="row g-0 align-items-stretch">
        <div class="col-12">
          <download-form />
        </div>
      </div>
    </div>
    <div v-if="!$screen.md">
      <button
        type="button"
        class="btn btn-secondary collapsed position-fixed start-0 top-50"
        style="z-index: 99; overflow-anchor: none;"
      >
        {{ t('app.filelist.header') }}
      </button>
      <div tabindex="-1" class="b-sidebar-outer">
        <div
          tabindex="-1"
          class="b-sidebar shadow bg-transparent text-dark"
          style="width: 250px; display: none;"
        >
          <div class="b-sidebar-body d-flex">
            <file-list />
          </div>
        </div>
      </div>
      <button
        type="button"
        class="btn btn-secondary collapsed position-fixed end-0 top-50"
        style="z-index: 99; overflow-anchor: none;"
      >
        {{ t('app.filterlist.header') }}
      </button>
      <div tabindex="-1" class="b-sidebar-outer">
        <div
          tabindex="-1"
          class="b-sidebar shadow b-sidebar-right bg-transparent text-dark"
          style="width: 250px; display: none;"
        >
          <div class="b-sidebar-body d-flex">
            <filter-list />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {useI18n} from 'vue-i18n';
// import Vue from 'vue';
// import HelloWorld from './components/HelloWorld.vue';

export default defineComponent({
  name: 'App',
  setup() {
    const {t, availableLocales} = useI18n({useScope: 'global'});
    return {t, availableLocales};
  },
});
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

.card-body {
  min-height: 0;
}
</style>

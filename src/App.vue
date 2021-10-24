<i18n src="./common/locales.json"></i18n>

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
              aria-label="Toggle navigation"
              class="navbar-toggler collapsed"
              aria-expanded="false"
              aria-controls="nav-collapse"
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
                    id="__BVID__13__BV_toggle_"
                    role="button"
                    aria-haspopup="true"
                    aria-expanded="false"
                    href="#"
                    target="_self"
                    class="nav-link dropdown-toggle"
                    data-bs-toggle="dropdown"
                    ><span>{{ $t('app.chooselang') }}</span></a
                  >
                  <ul
                    tabindex="-1"
                    class="dropdown-menu dropdown-menu-end"
                    aria-labelledby="__BVID__13__BV_toggle_"
                  >
                    <li role="presentation" class="text-uppercase">
                      <a
                        v-for="lang in supportLangs"
                        :key="lang"
                        role="menuitem"
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
        <div class="col-12 mh-100 p-1">
          <download-form />
        </div>
      </div>
    </div>
    <div v-if="!$screen.md">
      <button
        type="button"
        class="btn btn-secondary collapsed position-fixed end-0 top-50"
        aria-expanded="false"
        aria-controls="sidebar-files-backdrop"
        style="z-index: 99; overflow-anchor: none;"
      >
        {{ $t('app.filelist.header') }}
      </button>
      <div tabindex="-1" class="b-sidebar-outer">
        <div
          id="sidebar-files-backdrop"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          aria-hidden="true"
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
        aria-expanded="false"
        aria-controls="sidebar-filters-backdrop"
        style="z-index: 99; overflow-anchor: none;"
      >
        {{ $t('app.filterlist.header') }}
      </button>
      <div tabindex="-1" class="b-sidebar-outer">
        <div
          id="sidebar-filters-backdrop"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          aria-hidden="true"
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
import Vue from 'vue';
import previewCanvas from './components/preview-canvas.vue';
import fileList from './components/file-list.vue';
import filterList from './components/filter-list.vue';
// import downloadForm from '@/components/download-form.vue';

export default Vue.extend({
  name: 'App',
  components: {
    previewCanvas,
    fileList,
    filterList,
    //   downloadForm,
  },
  data: function() {
    return {};
  },
  computed: {
    supportLangs() {
      return Object.keys(this.$i18n.messages);
    },
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

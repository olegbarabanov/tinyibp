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
              ><span>TinyIBP ({{ APP_VERSION }})</span></a
            ><button
              type="button"
              class="navbar-toggler collapsed"
              style="overflow-anchor: none;"
              data-bs-toggle="collapse"
              data-bs-target="#nav-collapse2"
            >
              <span class="navbar-toggler-icon" />
            </button>
            <div id="nav-collapse2" class="navbar-collapse collapse">
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
                        @click="locale = lang"
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
        v-if="$grid.md"
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
    <div v-if="!$grid.md">
      <button
        type="button"
        class="btn btn-secondary collapsed position-fixed start-0 top-50"
        style="z-index: 99; overflow-anchor: none;"
        @click="visibleMobileFilePanel = true"
      >
        {{ t('app.filelist.header') }}
      </button>
      <div tabindex="-1" class="b-sidebar-outer">
        <div
          v-show="visibleMobileFilePanel"
          tabindex="-1"
          class="b-sidebar shadow bg-transparent text-dark"
          style="width: 250px;"
        >
          <div class="b-sidebar-body d-flex">
            <file-list />
          </div>
        </div>
        <div
          v-show="visibleMobileFilePanel"
          class="b-sidebar-backdrop bg-dark"
          @click="visibleMobileFilePanel = false"
        ></div>
      </div>

      <button
        type="button"
        class="btn btn-secondary collapsed position-fixed end-0 top-50"
        style="z-index: 99; overflow-anchor: none;"
        @click="visibleMobileFilterPanel = true"
      >
        {{ t('app.filterlist.header') }}
      </button>
      <div tabindex="-1" class="b-sidebar-outer">
        <div
          v-show="visibleMobileFilterPanel"
          tabindex="-1"
          class="b-sidebar shadow b-sidebar-right bg-transparent text-dark"
          style="width: 250px;"
        >
          <div class="b-sidebar-body d-flex">
            <filter-list />
          </div>
        </div>

        <div
          v-show="visibleMobileFilterPanel"
          class="b-sidebar-backdrop bg-dark"
          @click="visibleMobileFilterPanel = false"
        ></div>
      </div>
    </div>
  </div>

  <teleport to="#toast-container">
    <!-- <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 11"> -->
    <transition-group name="toast">
      <div
        v-for="[symbol, toast] in toastList"
        :key="symbol"
        class="toast show"
      >
        <div
          :class="
            `toast-header bg-${toast.type} bg-opacity-25 text-dark text-opacity-75`
          "
        >
          <strong class="me-auto">
            {{ toast.title }}
          </strong>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="toast"
          ></button>
        </div>
        <div
          :class="
            `toast-body bg-${toast.type} bg-opacity-25 text-dark text-opacity-75`
          "
        >
          {{ toast.text }}
        </div>
      </div>
    </transition-group>
    <!-- </div> -->
  </teleport>
</template>

<script lang="ts">
import {defineComponent, provide, reactive, ref} from 'vue';
import {useI18n} from 'vue-i18n';
import FileList from './components/file-list.vue';
import PreviewCanvas from './components/preview-canvas.vue';
import FilterList from './components/filter-list.vue';
import DownloadForm from './components/download-form.vue';
import {useStore} from './store';
import {Toast, key as toastKey} from './toast';
import {APP_VERSION} from './init';

export default defineComponent({
  name: 'App',
  components: {
    FileList,
    PreviewCanvas,
    FilterList,
    DownloadForm,
  },
  setup() {
    const {t, availableLocales, locale} = useI18n({useScope: 'global'});
    const store = useStore();
    const toastList = reactive(new Map<symbol, Toast>());
    const showToast = (toast: Toast) => {
      const symbol = Symbol();
      toastList.set(symbol, toast);
      setTimeout(() => toastList.delete(symbol), toast.duration);
    };
    provide(toastKey, showToast);
    const visibleMobileFilePanel = ref<boolean>(false);
    const visibleMobileFilterPanel = ref<boolean>(false);
    return {
      t,
      availableLocales,
      store,
      locale,
      showToast,
      toastList,
      visibleMobileFilePanel,
      visibleMobileFilterPanel,
      APP_VERSION,
    };
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}
</style>

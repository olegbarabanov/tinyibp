<i18n global src="../common/locales.json"></i18n>

<template>
  <div class="card h-100 text-center bg-transparent border-dark">
    <div
      class="card-header d-flex flex-row flex-wrap align-items-center justify-content-center p-1 bg-dark text-white"
      style="min-height: 3rem;"
    >
      <h5 class="my-0 mx-4 d-none d-md-block">
        {{ t('previewcanvas.header.text') }}
      </h5>
      <fieldset class="form-group d-inline-flex m-0 mx-4">
        <div>
          <div
            tabindex="-1"
            class="btn-group-toggle btn-group btn-group-sm bv-no-focus-ring"
          >
            <label v-for="(value, key) in options" :key="key">
              <input
                :id="key"
                v-model="selected"
                type="radio"
                name="radios-btn-default"
                class="btn-check"
                :value="key"
              />
              <label class="btn btn-secondary btn-sm" :for="key">
                {{ value }}</label
              >
            </label>
          </div>
        </div>
      </fieldset>
    </div>
    <div class="card-body h-100" @dblclick="fullSizePreview = !fullSizePreview">
      <div class="h-100 d-flex flex-column border border-left border-right">
        <div
          class="preview-layer b-overlay-wrap position-relative d-flex flex-column flex-grow-1 align-items-center justify-content-between overflow-auto p-1"
          :show="showProcessIndicator"
        >
          <canvas
            id="canvas"
            ref="canvas"
            class="mx-auto"
            :class="{
              'mw-100': !fullSizePreview,
              'mh-100': !fullSizePreview,
            }"
            :width="width"
            :height="height"
            rel="canvas"
          />
        </div>
      </div>
    </div>
    <div v-show="show" class="card-footer text bg-dark text-white">
      <p class="text-nowrap">
        <span class="badge d-inline-flex text-truncate mw-100 badge-secondary">
          {{ name }}
        </span>
      </p>
      <p>
        <span class="m-3"
          >{{ t('previewcanvas.dimensions.label')
          }}<span class="badge badge-secondary"
            >{{ width }}x{{ height }}</span
          ></span
        ><span v-show="selected !== 'preliminary-preview'" class="m-3"
          >{{ t('previewcanvas.size.label')
          }}<span class="badge badge-secondary"
            >{{ sizeToMb }} {{ t('previewcanvas.size.value') }}</span
          ></span
        ><span v-show="selected !== 'preliminary-preview'" class="m-3"
          >{{ t('previewcanvas.type.label')
          }}<span class="badge badge-secondary">{{ type }}</span></span
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {ImageBuilder} from '@/image-processor';
import {ImageBuilderWorkerProxy} from '@/image-processor/image-builder-worker-proxy';
import {useStore} from '@/store';
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  ref,
  toRaw,
  watch,
} from 'vue';
import {useI18n} from 'vue-i18n';

type SelectMode = 'original-preview' | 'preliminary-preview' | 'result-preview';

export default defineComponent({
  setup() {
    const {t} = useI18n({useScope: 'global'});
    const store = useStore();
    const canvas = ref<HTMLCanvasElement>();

    const selected = ref<SelectMode>('preliminary-preview');
    const width = ref<number>(0);
    const height = ref<number>(0);
    const showProcessIndicator = ref<boolean>(false);
    const size = ref<number>(0);
    const type = ref<string>('');
    const name = ref<string>('');
    const fullSizePreview = ref<boolean>(false);

    let updateTimeout = 0;
    let imageBuilder: ImageBuilder; // FIXME !!!!!!!!!!!!!

    const show = computed(() => store.state.showFileIndex !== null);
    const sizeToMb = computed(() => (size.value / 1000 ** 2).toFixed(3));
    const options = computed<
      {
        [K in SelectMode]: string;
      }
    >(() => {
      return {
        'original-preview': t('previewcanvas.viewselector.original.text'),
        'preliminary-preview': t('previewcanvas.viewselector.preliminary.text'),
        'result-preview': t('previewcanvas.viewselector.result.text'),
      };
    });

    const updateCanvas = function() {
      if (store.state.showFileIndex === null) {
        canvas.value
          ?.getContext('2d')
          ?.clearRect(0, 0, canvas.value?.width, canvas.value?.height);
        return;
      }
      showProcessIndicator.value = true;
      window.clearTimeout(updateTimeout);
      updateTimeout = window.setTimeout(async () => {
        let imageBitmap: ImageBitmap;
        if (store.state.showFileIndex === null) return;
        let blob = store.state.fileList[store.state.showFileIndex];
        if (selected.value === 'original-preview') {
          imageBuilder.setFilterMap([]);
          imageBitmap = await imageBuilder.buildImageBitmap();
          imageBuilder.setFilterMap(toRaw(store.state.filterMaps));
        } else if (selected.value === 'preliminary-preview') {
          imageBitmap = await imageBuilder.buildImageBitmap();
        } else if (selected.value === 'result-preview') {
          blob = await imageBuilder.buildFile();
          imageBitmap = await new ImageBuilderWorkerProxy(
            blob
          ).buildImageBitmap();
        } else {
          throw new Error('call unknown preview mode');
        }

        width.value = imageBitmap.width;
        height.value = imageBitmap.height;
        size.value = blob.size;
        type.value = blob.type;
        name.value = blob.name;

        canvas.value
          ?.getContext('2d')
          ?.clearRect(0, 0, canvas.value?.width, canvas.value?.height);

        nextTick(() => {
          canvas.value?.getContext('2d')?.drawImage(imageBitmap, 0, 0);
        });
        showProcessIndicator.value = false;
      }, 200);
    };

    const unmountWatchFilterMaps = store.watch(
      state => state.filterMaps,
      async () => {
        if (imageBuilder instanceof ImageBuilder) {
          imageBuilder.setFilterMap(toRaw(store.state.filterMaps));
        }
        await updateCanvas();
      },
      {deep: true}
    );

    const unmountWatchShowFileIndex = store.watch(
      state => {
        return state.showFileIndex;
      },
      async () => {
        if (store.state.showFileIndex === null) {
          await updateCanvas();
          return;
        }
        const blob = store.state.fileList[store.state.showFileIndex];
        if (!blob) {
          await updateCanvas();
          return;
        }
        imageBuilder = new ImageBuilderWorkerProxy(blob);
        imageBuilder.setType(store.state.type);
        imageBuilder.setQuality(store.state.quality);
        imageBuilder.setNameTransformPattern(store.state.nameTransformPattern);
        console.log('array', toRaw(store.state.filterMaps));
        console.log(1);
        imageBuilder.setFilterMap(toRaw(store.state.filterMaps));
        console.log(2);
        await updateCanvas();
        console.log(3);
      }
    );

    const unmountWatchType = store.watch(
      state => state.type,
      async () => {
        imageBuilder.setType(store.state.type);
        await updateCanvas();
      }
    );

    const unmountWatchQuality = store.watch(
      state => state.quality,
      async () => {
        imageBuilder.setQuality(store.state.quality);
        await updateCanvas();
      }
    );

    const unmountWatchNameTransformPattern = store.watch(
      state => state.nameTransformPattern,
      async () => {
        imageBuilder.setNameTransformPattern(store.state.nameTransformPattern);
        await updateCanvas();
      }
    );

    watch(selected, async () => {
      await updateCanvas();
    });

    onBeforeUnmount(() => {
      unmountWatchFilterMaps();
      unmountWatchShowFileIndex();
      unmountWatchType();
      unmountWatchQuality();
      unmountWatchNameTransformPattern();
    });

    return {
      t,
      selected,
      width,
      height,
      showProcessIndicator,
      size,
      type,
      name,
      fullSizePreview,
      show,
      sizeToMb,
      options,
      updateCanvas,
      canvas,
    };
  },
});
/*
export default Vue.extend({
  data() {
    return {
      selected: 'preliminary-preview' as string,
      width: 0 as number,
      height: 0 as number,
      updateTimeout: 0 as any,
      showProcessIndicator: false as boolean,
      size: 0 as number,
      type: '' as string,
      name: '' as string,
      fullSizePreview: false,
      imageBuilder: undefined,
    };
  },
  computed: {
    show: function() {
      return this.$store.state.showFileIndex !== null;
    },
    sizeToMb: function() {
      return (this.$data.size / 1000 ** 2).toFixed(3);
    },
    options: function() {
      return [
        {
          value: 'original-preview',
          text: this.$t('previewcanvas.viewselector.original.text'),
        },
        {
          value: 'preliminary-preview',
          text: this.$t('previewcanvas.viewselector.preliminary.text'),
        },
        {
          value: 'result-preview',
          text: this.$t('previewcanvas.viewselector.result.text'),
        },
      ];
    },
  },
  watch: {
    '$store.state.filterMaps': {
      handler: async function() {
        if (this.$data.imageBuilder instanceof ImageBuilder) {
          this.$data.imageBuilder.setFilterMap(this.$store.state.filterMaps);
        }
        await this.updateCanvas();
      },
      deep: true,
    },
    '$store.state.showFileIndex': async function() {
      const blob = this.$store.state.fileList[this.$store.state.showFileIndex];
      if (!blob) {
        await this.updateCanvas();
        return;
      }
      const imageBuilder = new ImageBuilderWorkerProxy(blob);
      imageBuilder.setType(this.$store.state.type);
      imageBuilder.setQuality(this.$store.state.quality);
      imageBuilder.setNameTransformPattern(
        this.$store.state.nameTransformPattern
      );
      imageBuilder.setFilterMap(this.$store.state.filterMaps);
      this.$data.imageBuilder = imageBuilder;
      await this.updateCanvas();
    },
    '$store.state.type': async function() {
      this.$data.imageBuilder.setType(this.$store.state.type);
      await this.updateCanvas();
    },
    '$store.state.quality': async function() {
      this.$data.imageBuilder.setQuality(this.$store.state.quality);
      await this.updateCanvas();
    },
    '$store.state.nameTransformPattern': async function() {
      this.$data.imageBuilder.setNameTransformPattern(
        this.$store.state.nameTransformPattern
      );
      await this.updateCanvas();
    },
    selected: async function() {
      await this.updateCanvas();
    },
  },
  methods: {
    updateCanvas: function() {
      const canvas = this.$refs.canvas as HTMLCanvasElement;
      if (this.$store.state.showFileIndex === null) {
        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }
      this.showProcessIndicator = true;
      window.clearTimeout(this.updateTimeout);
      this.updateTimeout = window.setTimeout(async () => {
        let imageBitmap: ImageBitmap;
        let blob = this.$store.state.fileList[this.$store.state.showFileIndex];

        if (this.selected === 'original-preview') {
          this.$data.imageBuilder.setFilterMap([]);
          imageBitmap = await this.$data.imageBuilder.buildImageBitmap();
          this.$data.imageBuilder.setFilterMap(this.$store.state.filterMaps);
        } else if (this.selected === 'preliminary-preview') {
          imageBitmap = await this.$data.imageBuilder.buildImageBitmap();
        } else if (this.selected === 'result-preview') {
          blob = await this.$data.imageBuilder.buildFile();
          imageBitmap = await new ImageBuilderWorkerProxy(
            blob
          ).buildImageBitmap();
        } else {
          throw new Error('call unknown preview mode');
        }

        this.width = imageBitmap.width;
        this.height = imageBitmap.height;
        this.size = blob.size;
        this.type = blob.type;
        this.name = blob.name;

        canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);

        this.$nextTick(() =>
          canvas.getContext('2d')?.drawImage(imageBitmap, 0, 0)
        );
        this.showProcessIndicator = false;
      }, 200);
    },
  },
  //updated: function() {
  //  this.updateCanvas();
  // }
});

*/
</script>

<style>
.preview-layer {
  contain: size;
}

.preview-layer:before,
.preview-layer:after {
  content: '';
}
</style>

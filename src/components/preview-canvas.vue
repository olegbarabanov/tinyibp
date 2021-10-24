<i18n src="../common/locales.json"></i18n>

<template>
  <div class="card h-100 text-center bg-transparent border-dark">
    <div
      class="card-header d-flex flex-row flex-wrap align-items-center justify-content-center p-1 bg-dark text-white"
      style="min-height: 3rem;"
    >
      <h5 class="my-0 mx-4 d-none d-md-block">
        {{ $t('previewcanvas.header.text') }}
      </h5>
      <fieldset id="__BVID__28" class="form-group d-inline-flex m-0 mx-4">
        <div>
          <div
            id="btn-radios-1"
            role="radiogroup"
            tabindex="-1"
            class="btn-group-toggle btn-group btn-group-sm bv-no-focus-ring"
          >
            <label v-for="option in options" :key="option.value">
              <input
                :id="option.value"
                v-model="selected"
                type="radio"
                name="radios-btn-default"
                class="btn-check"
                :value="option.value"
              />
              <label class="btn btn-secondary btn-sm" :for="option.value">
                {{ option.text }}</label
              >
            </label>
          </div>
        </div>
      </fieldset>
    </div>
    <div
      class="card-body h-100"
      style="min-height: 0;"
      @dblclick="fullSizePreview = !fullSizePreview"
    >
      <!----><!---->
      <div class="h-100 d-flex flex-column border border-left border-right">
        <div
          class="b-overlay-wrap position-relative d-flex flex-grow-1 align-items-center justify-content-center overflow-auto p-1"
          :show="showProcessIndicator"
        >
          <canvas
            id="canvas"
            ref="canvas"
            :class="{
              'mw-100': !fullSizePreview,
              'mh-100': !fullSizePreview,
            }"
            :width="width"
            :height="height"
          />
        </div>
      </div>
    </div>
    <div
      v-show="show"
      class="card-footer text bg-dark text-white"
      style="display: none;"
    >
      <p class="text-nowrap">
        <span class="badge d-inline-flex text-truncate mw-100 badge-secondary">
          {{ name }}
        </span>
      </p>
      <p>
        <span class="m-3"
          >{{ $t('previewcanvas.dimensions.label')
          }}<span class="badge badge-secondary"
            >{{ width }}x{{ height }}</span
          ></span
        ><span v-show="selected !== 'preliminary-preview'" class="m-3"
          >{{ $t('previewcanvas.size.label')
          }}<span class="badge badge-secondary"
            >{{ sizeToMb }} {{ $t('previewcanvas.size.value') }}</span
          ></span
        ><span v-show="selected !== 'preliminary-preview'" class="m-3"
          >{{ $t('previewcanvas.type.label')
          }}<span class="badge badge-secondary">{{ type }}</span></span
        >
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import {ImageBuilder} from '@/image-processor';
import {ImageBuilderWorkerProxy} from '@/image-processor/image-builder-worker-proxy';
import Vue from 'vue';

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
</script>

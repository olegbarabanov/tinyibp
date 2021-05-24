<i18n src="../common/locales.json"></i18n>

<template>
  <b-card
    bg-variant="transparent"
    class="h-100 text-center"
    border-variant="dark"
    no-body
  >
    <b-card-header
      header-bg-variant="dark"
      header-text-variant="white"
      class="d-flex flex-row align-items-center justify-content-center p-1"
      style="min-height:3rem"
    >
      <h5 class="my-0 mx-4 d-none d-md-block">
        {{ $t('previewcanvas.header.text') }}
      </h5>
      <b-form-group v-slot="{ariaDescribedby}" class="d-inline-flex m-0 mx-4">
        <b-form-radio-group
          id="btn-radios-1"
          v-model="selected"
          :options="options"
          :aria-describedby="ariaDescribedby"
          name="radios-btn-default"
          size="sm"
          buttons
        />
      </b-form-group>
    </b-card-header>
    <b-card-body class="h-100" @dblclick="fullSizePreview = !fullSizePreview">
      <div class="h-100 d-flex flex-column border border-left border-right">
        <b-overlay
          :show="showProcessIndicator"
          class="d-flex flex-grow-1 align-items-center justify-content-center overflow-auto p-1"
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
        </b-overlay>
      </div>
    </b-card-body>
    <b-card-footer
      v-show="show"
      footer-bg-variant="dark"
      footer-text-variant="white"
      class="text"
    >
      <p class="text-nowrap">
        <b-badge class="d-inline-flex text-truncate mw-100">
          {{ name }}
        </b-badge>
      </p>
      <p>
        <span class="m-3"
          >{{ $t('previewcanvas.dimensions.label') }}
          <b-badge>{{ width }}x{{ height }}</b-badge></span
        >
        <span v-show="selected !== 'preliminary-preview'" class="m-3"
          >{{ $t('previewcanvas.size.label')
          }}<b-badge
            >{{ sizeToMb }} {{ $t('previewcanvas.size.value') }}</b-badge
          ></span
        >
        <span v-show="selected !== 'preliminary-preview'" class="m-3"
          >{{ $t('previewcanvas.type.label')
          }}<b-badge>{{ type }}</b-badge></span
        >
      </p>
    </b-card-footer>
  </b-card>
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

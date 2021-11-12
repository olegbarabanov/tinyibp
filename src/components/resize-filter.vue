<i18n src="../common/locales.json"></i18n>

<template>
  <form @submit.stop.prevent>
    <fieldset class="form-group m-0">
      <legend tabindex="-1" class="col-form-label pt-0">
        {{ $t('resizefilter.form.size.label') }}
      </legend>
      <div>
        <div class="input-group">
          <div class="input-group-text">
            X:
          </div>
          <input
            type="number"
            min="0"
            step="1"
            class="form-control"
            :value="width"
            @input="updateWidth($event.target.value)"
          />
          <div class="input-group-text">
            Y:
          </div>
          <input
            type="number"
            min="0"
            step="1"
            class="form-control"
            :value="height"
            @input="updateHeight($event.target.value)"
          />
        </div>
        <small tabindex="-1" class="form-text text-muted">{{
          $t('resizefilter.form.size.description')
        }}</small>
      </div>
    </fieldset>
  </form>

  <!-- <b-form @submit.stop.prevent>
    <b-form-group
      :description="$t('resizefilter.form.size.description')"
      :label="$t('resizefilter.form.size.label')"
      class="m-0"
    >
      <b-input-group>
        <b-input-group-text>
          X:
        </b-input-group-text>
        <b-form-input
          :value="width"
          type="number"
          min="0"
          step="1"
          @input="updateWidth"
        />
        <b-input-group-text>
          Y:
        </b-input-group-text>
        <b-form-input
          :value="height"
          type="number"
          min="0"
          step="1"
          @input="updateHeight"
        />
      </b-input-group>
    </b-form-group>
  </b-form> -->
</template>

<script lang="ts">
import Vue from 'vue';
import SequenceId from '@/utils/sequence-id';

export default Vue.extend({
  props: {
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      componentID: SequenceId.getNew(),
    };
  },
  methods: {
    updateWidth: function(value: string) {
      this.$emit('update:width', Number(value));
    },
    updateHeight: function(value: string) {
      this.$emit('update:height', Number(value));
    },
  },
});
</script>

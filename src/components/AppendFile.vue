<template>
  <b-form @submit.stop.prevent>
    <b-form-file
      v-model="fileList"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      accept="image/*"
      multiple
      ref="form-file"
    ></b-form-file>
    <b-list-group>
      <b-list-group-item
        v-for="file in globalFileList"
        v-bind:key="file.symbolIndex"
        action
        v-on:click="$store.commit('showFile', file.symbolIndex)"
        class="d-flex justify-content-between align-items-center"
        >{{ file.name }}
        <b-button size="sm"><b-icon icon="trash-fill" aria-hidden="true" v-on:click.stop="$store.commit('deleteFile', file.symbolIndex)"></b-icon></b-button>
                
      </b-list-group-item>
    </b-list-group>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
    };
  },
  watch: {
    fileList: function (newFileList) {
      newFileList.map((file) => this.$store.commit("setFile", file));
      this.$refs["form-file"].reset();
    },
  },
  computed: {
    globalFileList: function () {
      return this.$store.state.fileList;
    },
    globalUrlFileList: function () {
      return this.globalFileList.map((file) => URL.createObjectURL(file));
    },
  },
};
</script>

<style>
</style>
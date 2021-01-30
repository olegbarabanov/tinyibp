<template>
<div>
  <b-form-file multiple directory>
   <template slot="file-name" slot-scope="{ names }">
     <b-badge variant="dark">{{ names[0] }}</b-badge>
     <b-badge v-if="names.length > 1" variant="dark" class="ml-1">
       + {{ names.length - 1 }} More files
     </b-badge>
   </template>
  </b-form-file>
<div>
  
  <b-button v-b-toggle.collapse-1 variant="primary">Toggle Collapse</b-button>
  <b-collapse id="collapse-1" class="mt-2">
    <b-card>
      <p class="card-text">Collapse contents Here</p>
      <b-button v-b-toggle.collapse-1-inner size="sm">Toggle Inner Collapse</b-button>
      <b-collapse id="collapse-1-inner" class="mt-2">
        <b-card>Hello!</b-card>
      </b-collapse>
    </b-card>
  </b-collapse>
</div>

</div>
</template>
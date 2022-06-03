<template>
  <div class="building-form-container">
      <a-form>
        <a-form-item>
            <a-input></a-input>
        </a-form-item>
        <a-form-item>
            <a-input></a-input>
        </a-form-item>
      </a-form>
      <a-list>
        <a-list-item></a-list-item>
      </a-list>
      <a-drawer>
          <classroom-form/>
      </a-drawer>
  </div>
</template>

<script lang="ts">

import Vue from 'vue'

import ClassroomForm from '~/components/ClassroomForm.vue'

export default Vue.extend({
    components: {
        ClassroomForm
    }
})
</script>

<style>

</style>
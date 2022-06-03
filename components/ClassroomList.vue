<template>
  <a-list :loading="loading" >
    <a-list-item></a-list-item>
  </a-list>
</template>

<script lang='ts'>

import Vue from 'vue'
import Classroom from '~/models/classroom'

export default Vue.extend({
    props: {
        loading : {
            type: Boolean,
            required: true
        },
        classrooms: {
            type: Array as () => Classroom[],
            required: true
        }
    }
})

</script>

<style>

</style>
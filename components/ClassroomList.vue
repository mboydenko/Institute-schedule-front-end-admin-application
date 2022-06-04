<template>
  <a-list :data-source="data" :loading="loading" bordered size="small">
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <h3 :style="{marginLeft: '10px'}">{{item.classroom.name}}</h3>
      <span slot="actions">
        <a-button type="primary" @click="onEditButtonClick(item)"><a-icon type="edit"></a-icon></a-button>
        <a-divider type="vertical"></a-divider>
        <a-button type="danger"  @click="onDeleteButtonClick(item)" :loading="item.deleting"><a-icon type="delete"></a-icon></a-button>
      </span>
    </a-list-item>
  </a-list>
</template>

<script lang='ts'>

import Vue from 'vue'
import Classroom from '~/models/classroom'

export interface Item {
  deleting: boolean,
  classroom: Classroom
}

interface ListItem {
  id: number,
  deleting: boolean,
  classroom: Classroom
}

export default Vue.extend({
    props: {
        loading : {
            type: Boolean,
            required: true
        },
        classrooms: {
            type: Array as () => Item[],
            required: true
        }
    },

    computed: {
      data() : ListItem[]{
        return this.classrooms.map((element=>{
          return  {
            id: element.classroom.id,
            deleting: element.deleting,
            classroom: element.classroom
          }
        }))
      }
    },

    methods: {
      onEditButtonClick(item: Item) {
        this.$emit("editButtonClick", item)
      },
      onDeleteButtonClick(item: Item) {
        this.$emit('deleteButtonClick', item)
      }
    }
})

</script>

<style>

</style>
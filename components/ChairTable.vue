<template>
  <a-table
  :pagination="pagination" 
  :dataSource="tableData" 
  :columns="columns" 
  :loading="loading"
  >
        <span slot="name" slot-scope="text">{{text}}</span>
        <span slot="abbreviation" slot-scope="abbreviation"><div style="font-size:50px">{{abbreviation}}</div></span>
        <span  slot="action"  slot-scope="record">
            <a-button type="primary" @click="onEditButtonClick(record.chair)"><a-icon type="edit"></a-icon></a-button>
            <a-divider type="vertical" slot="action"/>
            <a-button type="danger" @click="onDeleteButtonClick(record.chair)"><a-icon type="delete"></a-icon></a-button>
        </span>
    </a-table>
</template>

<script lang="ts">

import { Table } from 'ant-design-vue'
import Vue from 'vue'
import Chair from '~/models/chair'

interface TableItem {
    key: number,
    name: string,
    abbreviation: string
    chair: Chair
}

const columns = [
    {
        dataIndex: 'name',
        key: 'name',
        title: "Наименование"
    },
    {
        dataIndex:"abbreviation",
        key: "abbreviation",
        title: 'Аббревиатура'
    },
    {
        title: 'Действия',
        key: 'action',
        scopedSlots: { customRender: 'action' }
    }
]

export default Vue.extend({
    props: {
        loading: {
            type: Boolean,
            required: true
        },
        chairs: {
            type: Array as ()=> Chair[],
            required: true
        }
    },

    methods: {
        onEditButtonClick(chair: Chair) {
            this.$emit("editButtonClick", chair)
        },
        onDeleteButtonClick(chair: Chair) {
            this.$emit("deleteButtonClick", chair)
        }
    },
    
    computed: {
        columns: ()=> columns,
        tableData() : TableItem[] {
            return this.chairs.map(chair=>{
                return  {
                    key: chair.id,
                    name: chair.name,
                    abbreviation: chair.abbreviation,
                    chair: chair
                }
            })
        },
        pagination() {
            return {
                pageSize: 8
            }
        },
    }
})
</script>
<style>
</style>
<template>
    <a-table 
    :pagination="pagination"
    :columns="tableColumns"
    :loading="loading"
    :dataSource="tableData">
    <span slot="name" slot-scope="text">{{text}}</span>
    <span slot="action" slot-scope="record">
        <a-button type="primary" @click="onEditButtonClick(record.discipline)"><a-icon type="edit"></a-icon></a-button>
        <a-divider type="vertical"/>
        <a-button type="danger" @click="onDeleteButtonClick(record.discipline)"><a-icon type="delete"></a-icon></a-button>
    </span>
    </a-table>
</template>

<script lang="ts">

import Vue from 'vue'
import Discipline from '~/models/discipline'

interface TableItem {
    name: string,
    discipline: Discipline
}

const columns = [
    {
        key: 'name',
        dataIndex: 'name',
        title: 'Наименование',
    },
    {
        key: 'action',
        title: 'Действия',
        scopedSlots: {customRender: 'action'}
    }
]

export default Vue.extend({
    props: {
        disciplines: {
            type: Array as ()=> Discipline[],
            required: true
        },
        loading: {
            type: Boolean,
            required: true
        }
    },
    
    methods: {
        onDeleteButtonClick(discipline: Discipline) {
            this.$emit('deleteButtonClick', discipline)
        },

        onEditButtonClick(discipline: Discipline) {
            this.$emit('editButtonClick', discipline)
        }
    },

    computed: {
        tableData() : TableItem[] {
            return  this.disciplines.map(element=>{
                return {
                    name: element.name,
                    discipline: element
                }
            })
        },
        pagination() {
            return {
                pageSize: 8
            }
        },
        tableColumns() {
            return columns;
        }
    }
})

</script>

<style>

</style>
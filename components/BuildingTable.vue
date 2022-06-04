<template>
    <a-table :loading="loading" :dataSource="tableData" :columns="columns">
        <span slot="name" slot-scope="text">{{text}}</span>
        <span slot="shortName" slot-scope="text">{{text}}</span>
        <span slot="action" slot-scope="record">
            <a-button type="primary" @click="onEditButtonClick(record.building)"><a-icon type="edit"></a-icon></a-button>
            <a-divider type="vertical"/>
            <a-button type="danger" @click="onDeleteButtonClick(record.building)"><a-icon type="delete"></a-icon></a-button>
        </span>
    </a-table>
</template>

<script lang="ts">

import Vue from 'vue'
import Building from '~/models/building'

interface TableItem {
    key: number,
    name: string
    shortName: string
    building: Building,
}

const columns = [
    {
        title: 'Наименование',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Сокращение',
        key: 'shortName',
        dataIndex: 'shortName'
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
        buildings: {
            type: Array as ()=> Building[],
            required: true
        }
    },
    
    methods: {
        onEditButtonClick(building: Building) {
            this.$emit("editButtonClick", building)
        },
        
        onDeleteButtonClick(building: Building) {
            this.$emit("deleteButtonClick", building)
        }
    },

    computed: {
        tableData() : TableItem[] {
            console.log(this.buildings)
            return this.buildings.map(building=>{
                return {
                    key: building.id,
                    name: building.name,
                    shortName: building.shortName,
                    building: building
                }
            })
        },

        columns: ()=> columns
    }
})

</script>

<style>

</style>
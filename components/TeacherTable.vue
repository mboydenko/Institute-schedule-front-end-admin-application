<template>
  <a-table :columns="columns" :data-source="tableData" :loading="loading" class="teacher-table">
        <span slot="name" slot-scope="text">{{text}}</span>
        <span slot="chair" slot-scope="text">{{text}}</span>
        <span slot="action" slot-scope="record">
        <a-button type="primary" slot="action" @click="onEditButtonClick(record.teacher)"><a-icon type="edit"></a-icon></a-button>
        <a-divider type="vertical" slot="action"/>
        <a-button type="danger" slot="action" @click="onDeleteButtonClick(record.teacher)"><a-icon type="delete"></a-icon></a-button>
        </span>
    </a-table>
</template>

<script lang="ts">

import Vue from 'vue'
import Teacher from '~/models/teacher'

interface TableItem {
    id: number,
    key: number,
    name: string,
    email: string,
    chair: string,
    teacher: Teacher
}

const columns = [
    {
        dataIndex:'name',
        key:'name',
        title:'Преподаватель'
    },
    {
        dataIndex:'email',
        key:'email',
        title: 'Электронная почта'
    },
    {
        title: "Кафедра",
        key: "chair",
        dataIndex: "chair"
    },
    {
        title: "Действия",
        key: 'action',
        scopedSlots: { customRender: 'action' }
    }
]


export default Vue.extend({
    props: {
        teachers: {
            type: Array as ()=> Teacher[],
            required: true
        },
        loading: {
            type: Boolean,
            required: true
        }
    },

    methods: {
        onEditButtonClick(teacher: Teacher) {
            // console.log(teacher)
            this.$emit('editButtonClick', teacher)
        },

        onDeleteButtonClick(teacher:Teacher) {
            //  console.log(teacher)
            this.$emit('deleteButtonClick', teacher)
        }
    },

    computed: {
        columns: ()=> columns,
        tableData() : TableItem[] {
            return this.teachers.map(teacher=>{
                return {
                    id: teacher.id,
                    key: teacher.id,
                    name: `${teacher.lastName} ${teacher.firstName[0]}.${teacher.middleName[0]}.`,
                    email: teacher.email,
                    chair: teacher.chair.abbreviation,
                    teacher: teacher
                }
            })
        }
    }
})
</script>

<style>

</style>
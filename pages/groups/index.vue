<template>
  <div class="groups-page">
      <div class="add-teacher-button-container">
            <a-button type="primary" @click="openCreationForm()"><a-icon type="usergroup-add" />Добавить группу</a-button>
        </div>
    <a-table :columns="tableColumns" :data-source="tableData()" :loading="dataLoading" class="teacher-table">
        <span slot="name" slot-scope="record">
            <h1>{{record.group.name}}</h1>
        </span>
        <span slot="action" slot-scope="record">
        <a-button type="primary" @click="openEditingForm(record.group)"><a-icon type="edit"></a-icon></a-button>
        <a-divider type="vertical"/>
        <a-button type="danger" @click="deleteGroup(record.group)"><a-icon type="delete"></a-icon></a-button>
        </span>
    </a-table>
    <a-drawer
    :title="formTitle"
    :width="'50%'"
    :visible="formOpened"
    @close="closeForm"
    >
    <div v-if="formOpened">
        <group-form 
        v-if="editingGroup != null" 
        :group="editingGroup" 
        @created="onCreated"
        @edited="onEdited"
        @cancelButtonClick="closeForm"
        />

        <group-form 
        v-else 
        @edited="onEdited"
        @created="onCreated"
        @cancelButtonClick="closeForm"
        />

    </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import Vue from 'vue'
import Group from '~/models/group'
import GroupService from '~/services/groups/groups.service'
import GroupForm from '~/components/GroupForm.vue'

interface DataInterface {
    groups: Group[],
    dataLoading: boolean,
    groupSelected: boolean

    formTitle: string,
    formOpened: boolean,
    editingGroup: Group | null,
}

interface TableItem {
    key: number,
    name: string
    group: Group
}

const tableColumns = [
    {
        dataIndex:'name',
        key:'name',
        title:'Группа'
    },
    {
        title: "Действия",
        key: 'action',
        scopedSlots: { customRender: 'action' }
    }
]


export default Vue.extend({
    components: {
        GroupForm
    },

    data() : DataInterface {
        return {
            groups: [],
            dataLoading: false,
            groupSelected: false,

            editingGroup: null,
            formTitle: "",
            formOpened: false,
        }
    },

    methods: {
        deleteGroup(group: Group) {
            GroupService.instance.delete(group.id)
            .then((value)=>{
                notification['success']({
                    message: "Операция прошла успешно",
                    description: `Группа ${group.name} была удалена`
                })
                this.groups.splice(this.groups.indexOf(group), 1)
            })
            .catch((e : Error)=>{
                notification['error']({
                    message: "Ошибка",
                    description: `${e.message}`
                })
            })
        },

        openEditingForm(group: Group) {
            
            this.editingGroup = group

            this.formTitle = `Группа ${group.name}`

            this.groupSelected = true

            this.formOpened = true
        },

        openCreationForm() {
            this.editingGroup = null

            this.groupSelected = false

            this.formTitle = `Добавление группы`

            this.formOpened = true
        },

        closeForm() {

            this.editingGroup = null
            
            this.formTitle = ""

            this.formOpened = false
        },

        tableData() : TableItem[] {
            return this.groups.map(group=>{
                return  {
                    name: group.name,
                    key: group.id,
                    group: group
                }
            })
        },

        loadGroups() : void {
            this.dataLoading = true
            GroupService.instance.all()
            .then(groups=>{
                this.groups = groups.sort((g1, g2)=> {
                    return g1.id - g2.id
                })
                this.dataLoading = false
            })
            .catch((e : Error) =>{
                notification['error']({
                    message: "Ошибка",
                    description: e.message
                })
                this.dataLoading = false
            })
        },

        onEdited(group: Group) {
            console.log('On edited')
            notification['success']({
                message: "Операция прошла успешно",
                description: "Данные о группе обновлены"
            })
            this.groups = this.groups.map(g => {
                if(g.id === group.id) {
                    return group
                }
                return g
            })
            this.openEditingForm(group)
        },

        onCreated(group: Group) {
            console.log('On created')
            notification['success']({
                message: "Операция прошла успешно",
                description:`Добавлена новая группа - ${group.name}`
            })
            this.groups.push(group)
            this.groups = this.groups.sort((g1,g2)=> g1.id - g2.id)
            this.openEditingForm(group)
        }
    },

    computed: {
        tableColumns() {
            return tableColumns
        }
    },

    mounted() {
        this.loadGroups()
    }
})

</script>

<style>

</style>
<template>
    <div>
        <a-button type="primary" @click="openCreationForm">
            <a-icon type="plus"></a-icon>
            Добавить дисциплину
        </a-button>
        <discipline-table 
        :loading="loading" 
        :disciplines="disciplines"
        @editButtonClick="onEditButtonClick"
        @deleteButtonClick="onDeleteButtonClick"
        @created="onCreated"
        @edited="onEdited"
        />
        <a-drawer
            :title="formTitle"
            :width="'50%'"
            :visible="formOpened"
            @close="closeForm"
        >
        <div v-if="formOpened">
            <discipline-form 
            v-if="editingDiscipline != null" 
            :discipline="editingDiscipline"
            @cancelButtonClick="closeForm"
            @created="onCreated"
            @edited="onEdited"
            />
            <discipline-form 
            v-else
            @cancelButtonClick="closeForm"
            @created="onCreated"
            @edited="onEdited"
            />
        </div>
        </a-drawer>
    </div>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import Vue from 'vue'
import DisciplineTable from '~/components/DisciplineTable.vue'
import Discipline from '~/models/discipline'
import DisciplineService from '~/services/disciplines/disciplines.service'
import DisciplineForm from '~/components/DisciplineForm.vue'

interface Data {
    loading: boolean,
    disciplines: Discipline[],
    editingDiscipline: Discipline | null,
    formOpened: boolean,
    formTitle: string
}

export default Vue.extend({
  
    components: { DisciplineTable, DisciplineForm },

    data() : Data {
        return  {
            loading: false,
            disciplines: [],
            editingDiscipline: null,
            formOpened: false,
            formTitle: ""
        }
    },

    mounted() {
        this.loadDisciplines()
    },

    methods: {
        loadDisciplines() {
            this.loading = true
            DisciplineService.instance.all()
            .then(disciplines => {
                this.disciplines = disciplines
                this.loading = false
            })
            .catch(e=>{
                notification['error']({
                    message: "Ошибка загрузки",
                    description: e.message
                })
                this.loading = false
            })
        },

        onCreated(discipline: Discipline) {
            this.disciplines.push(discipline)
            this.openDiscipline(discipline)
        },

        onEdited(discipline: Discipline) {
            this.disciplines = this.disciplines.map(element=>{
                if(element.id === discipline.id) {
                    return discipline
                }
                return element
            })
            this.openDiscipline(discipline)
        },

        onDeleteButtonClick(discipline: Discipline) {
            DisciplineService.instance.delete(discipline.id)
            .then(()=>{
                this.disciplines.splice(this.disciplines.indexOf(discipline), 1)
                notification['success']({
                    message:"Операция прошла успешно",
                    description:`Дисциплина "${discipline.name}" была удалена`
                })
            })
            .catch(e=>{
                notification['error']({
                    message: "Ошибка",
                    description:e.message
                })
            })
        },

        onEditButtonClick(discipline: Discipline) {
            this.disciplines = this.disciplines.map(element=>{
                if(element.id === discipline.id) {
                    return discipline
                }
                return element
            })
            this.openDiscipline(discipline)
        },

        closeForm() {
            this.formOpened = false
        },

        openDiscipline(discipline: Discipline) {
            this.formTitle = discipline.name
            this.editingDiscipline = discipline
            this.formOpened = true
        },

        openCreationForm() {
            this.formTitle = "Добавить дисциплину"
            this.editingDiscipline = null
            this.formOpened = true
        }
    }
})

</script>

<style>

</style>
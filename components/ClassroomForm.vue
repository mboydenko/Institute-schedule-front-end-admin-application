<template>
  <a-form layout="vertical" :form="form" :required="true" @submit.prevent="onSubmit">
    <a-form-item label="Наименование">
        <a-input 
        v-decorator="[
            'name',
            {   
                rules: [
                    {
                        required: true,
                        message: 'Обязятельное поле'
                    }
                ]
                
            }
        ]">
        </a-input>
    </a-form-item>
    <a-form-item label="Корпус" v-if="!building && showBuildings" :required="true">
        <a-select v-model="selectedBuilding">
            <a-select-option 
                :key="0" 
                :value="null" 
               >
               "Корпус не выбран"
            </a-select-option>
            <a-select-option 
                :key="element.id" 
                :value="element" 
                v-for="element of buildings">
                {{element.shortName}}
            </a-select-option>
        </a-select>
    </a-form-item>
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button style="margin-right: 8px" @click="onCancelButtonClick">Отмена</a-button>
      <a-button type="primary" htmlType="submit" :loading="loading">{{loading ? "Сохранение" : "Сохранить"}}</a-button>
    </div>
  </a-form>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import { WrappedFormUtils } from 'ant-design-vue/types/form/form'
import Vue from 'vue'
import Building from '~/models/building'
import Classroom from '~/models/classroom'
import BuildingService from '~/services/buildings/buildings.service'
import ClassroomService from '~/services/classrooms/classroom.service'

interface Data {
    loading: boolean,
    buildings: Building[],
    buildingLoading: boolean,
    selectedBuilding: Building | null,
    currentClassroom: Classroom | null,
    form: WrappedFormUtils
}

export default Vue.extend({
    props: {
        building: {type: Object as ()=> Building, required: false},
        classroom: {type: Object as ()=> Classroom, required: false},
        showBuildings: {type: Boolean, required: false}
    },

    data() : Data {
        return  {
            loading: false,
            buildings: [],
            buildingLoading: false,
            selectedBuilding: null,
            currentClassroom: null,
            form: this.$form.createForm(this)
        } 
    },

    mounted() {
        if(!this.classroom) {            
            this.form.setFieldsValue({
                'name': ''
            })
            this.selectedBuilding = null
        } else {
            this.currentClassroom =  this.classroom
            this.form.setFieldsValue({
                'name': this.currentClassroom.name
            })
        }

        if(!this.building) {
            this.loadBuilding()
        } else {
            this.selectedBuilding = this.building
        }
    },

    methods: {
        loadBuilding() {
            this.buildingLoading = true
            BuildingService.instance.all()
            .then(buildings=>{
                this.buildingLoading = false
                this.buildings = buildings
            })
            .catch(e=>{
                this.buildingLoading = false
                notification['error']({
                    message:"Ошибка",
                    description: e.message
                })
            })
        },

        onSubmit() {
            this.form.validateFields(errors=>{
                if(!errors) {
                    if(this.currentClassroom) {
                        this.edit()
                    }
                    else {
                        this.create()
                    }
                }
            })
        },

        create() {
            this.loading = true

            ClassroomService.instance.create({
                name: this.getName(),
                buildingId: this.selectedBuilding!.id
            })
            .then(classroom => {
                
                this.currentClassroom = classroom
                
                notification['success']({
                    message: "Операция прошла успешно",
                    description: `Добавлена новая удитория в ${this.selectedBuilding?.name}`
                })
                
                this.$emit("created", this.currentClassroom)
            })
            .catch(e=>{
                notification['error']({
                    message: 'Ошибка',
                    description: e.message
                })
            })
            .finally(()=>{
                this.loading = false
            })
        },

        edit() {
             this.loading = true
            
            ClassroomService.instance.edit(
                this.currentClassroom!.id,
                {
                name: this.getName(),
                buildingId: this.selectedBuilding!.id
            })
            .then(classroom => {
                
                this.currentClassroom = classroom

                notification['success']({
                    message: "Операция прошла успешно",
                    description: `Данные об аудитории обновлены`
                })
                
                this.$emit("edited", this.currentClassroom)
            })
            .catch(e=>{
                notification['error']({
                    message: 'Ошибка',
                    description: e.message
                })
            })
            .finally(()=>{
                this.loading = false
            })
        },

        getName() : string {
            return this.form.getFieldValue('name')
        },

        onCancelButtonClick() {
            
        }
    },
})
</script>

<style>

</style>
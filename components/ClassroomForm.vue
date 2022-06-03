<template>
  <a-form layout="vertical" :form="form" :required="true">
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
    <a-form-item label="Корпус" v-if="!building" :required="true">
        <a-select v-model="selectedBuilding">
            <a-select-option 
                :key="0" 
                :value="0" 
               >
               "Корпус не выбран"
            </a-select-option>
            <a-select-option 
                :key="element.id" 
                :value="element.id" 
                v-for="element of buildings">
                {{element.shortName}}
            </a-select-option>
        </a-select>
    </a-form-item>
  </a-form>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import { WrappedFormUtils } from 'ant-design-vue/types/form/form'
import Vue from 'vue'
import Building from '~/models/building'
import Classroom from '~/models/classroom'
import BuildingService from '~/services/buildings/buildings.service'

interface Data {
    loading: boolean,
    buildings: Building[],
    buildingLoading: boolean,
    selectedBuilding: number,
    currentClassroom: Classroom | null,
    form: WrappedFormUtils
}

export default Vue.extend({
    props: {
        building: {type: Object as ()=> Building, required: false},
        classroom: {type: Object as ()=> Classroom, required: false}
    },

    data() : Data {
        return  {
            loading: false,
            buildings: [],
            buildingLoading: false,
            selectedBuilding: 0,
            currentClassroom: null,
            form: this.$form.createForm(this)
        } 
    },

    mounted() {
        if(!this.classroom) {
            // this.currentClassroom = this.classroom
            this.form.setFieldsValue({
                'name': ''
            })
            this.selectedBuilding = 0
        } else {
            this.currentClassroom =  this.classroom
            this.form.setFieldsValue({
                'name': this.currentClassroom.name
            })
        }

        if(!this.building) {
            this.loadBuilding()
        } else {
            this.selectedBuilding = this.building.id
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
        }
    },
})
</script>

<style>

</style>
<template>
  <div class="buildings-page">
      <div class="add-button-container">
          <a-button type="primary" @click="openCreationBuildingForm">Добавить</a-button>
      </div>
      <building-table 
      :buildings="buildings" 
      :loading="loading" 
      @editButtonClick="onBuildingTableEditButtonClick"
      @deleteButtonClick="onBuildingTableDeleteButtonClick"
      />
      <a-drawer
      :title="editingBuilding ? editingBuilding.name : 'Добавить корпус'"
      :visible="formOpened"
      :width='"50%"'
      @close="closeBuildingForm"
      >
      <span v-if="formOpened">
          <building-form 
          v-if="editingBuilding != null"
          :building="editingBuilding"
          @created="onBuildingCreated"
          @edited="onBuildingEdited"
          />
          <building-form 
          v-else
          @created="onBuildingCreated"
          @edited="onBuildingEdited"
          />
      </span>
      </a-drawer>
  </div>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import Vue from 'vue'

import BuildingTable from '~/components/BuildingTable.vue'
import Building from '~/models/building'
import BuildingService from '~/services/buildings/buildings.service'
import BuildingForm from '~/components/BuildingForm.vue'

interface Data {
    buildings: Building[]
    loading: boolean
    editingBuilding: Building | null,
    formOpened: boolean
}

export default Vue.extend({
    components: {
        BuildingTable,
        BuildingForm
    },

    data() : Data {
        return  {
            buildings: [],
            loading: false,
            formOpened: false,
            editingBuilding: null
        }
    },

    mounted() {
        this.loadBuildings()
    },

    methods: {
        loadBuildings() {
            this.loading = true
            BuildingService.instance.all()
            .then(buildings=>{
                this.loading = false
                this.buildings = buildings
            })
            .catch(e=>{
                this.loading = false
                notification['error']({
                    message:'Ошибка',
                    description: e.message
                })
            })
        },

        closeBuildingForm() {
            this.formOpened = false
        },

        openBuildingForm(building: Building) {
            this.editingBuilding = building
            this.formOpened = true
        },

        openCreationBuildingForm() {
            this.editingBuilding = null
            this.formOpened = true
        },

        onBuildingCreated(building: Building) {
            this.buildings.push(building)
            this.openBuildingForm(building)
        },

        onBuildingEdited(building: Building) {
            this.buildings = this.buildings.map(element=>{
                if(element.id === building.id) {
                    return building
                }
                return element 
            })
            this.openBuildingForm(building)
        },

        onBuildingTableEditButtonClick(building: Building) {
            console.log(building)
            this.openBuildingForm(building)
        },

        onBuildingTableDeleteButtonClick(building: Building) {
            
        }
    },
})

</script>

<style>

</style>
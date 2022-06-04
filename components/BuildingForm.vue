<template>
  <div class="building-form-container" @submit.prevent="onSubmit">
      <a-form :form="form" :required="true">
        <a-form-item label="Наименование">
            <a-input
            v-decorator="[
            'name',
            {
              rules: [
                {
                  required: true,
                  message:'Обязательное поле'
                }
              ]
              }
            ]"
            ></a-input>
        </a-form-item>
        <a-form-item label="Сокращение">
            <a-input
            v-decorator="[
            'shortName',
            {
              rules: [
                {
                  required: true,
                  message:'Обязательное поле'
                }
              ]
              }
            ]"
            ></a-input>
        </a-form-item>
        <span v-if="currentBuilding != null">
           <a-form-item label="Аудитории">
             <div class="add-classroom-button-container">
               <a-button type="primary" @click="openClassroomCreationForm">Добавить</a-button>
             </div>
             <classroom-list class="classroom-list-container"
             :classrooms="classrooms" 
             :loading="loading" 
             @deleteButtonClick="onClassroomListDeleteButtonClick"
             @editButtonClick="onClassroomListEditButtonClick"
             />
          </a-form-item>
        </span>
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
      <a-drawer 
      :visible="classroomFormOpened"
      :title="editingClassroom ? `Аудитория: ${editingClassroom.name}` : 'Добавить аудиторию'"
      :width="'50%'"
      @close="closeClassroomForm"
      >
        <span v-if="classroomFormOpened">
          <classroom-form 
            v-if="editingClassroom != null && currentBuilding != null" 
            :classroom="editingClassroom"
            :building="currentBuilding"
            :showBuildings="true"
            @created="onClassroomCreated"
            @edited="onClassroomEdited"
            />
          <classroom-form 
            v-else
            @created="onClassroomCreated"
            @edited="onClassroomEdited"
            :building="currentBuilding"
            :showBuildings="false"
          />
        </span>
      </a-drawer>
  </div>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import { WrappedFormUtils } from 'ant-design-vue/types/form/form'
import Vue from 'vue'

import ClassroomForm from '~/components/ClassroomForm.vue'
import Building from '~/models/building'
import Classroom from '~/models/classroom'
import BuildingService from '~/services/buildings/buildings.service'
import ClassroomService from '~/services/classrooms/classroom.service'
import ClassroomList, {Item} from '~/components/ClassroomList.vue';


interface Data {
  currentBuilding: Building | null
  classrooms: Item[]
  loading: boolean
  showClassrooms: boolean,
  classroomsLoading:boolean,
  form: WrappedFormUtils,
  editingClassroom: Classroom | null,
  classroomFormOpened: boolean
}

export default Vue.extend({
    components: {
        ClassroomForm,
        ClassroomList
    },

    props : {
      building: {
        type: Object as () => Building,
        required: false
      }
    },

    data() : Data {
      return  {
        classrooms: [],
        loading: false,
        showClassrooms: false,
        form: this.$form.createForm(this),
        classroomsLoading: false,
        classroomFormOpened: false,
        currentBuilding: null,
        editingClassroom: null
      }
    },

    mounted() {
      if(this.building) {
        this.currentBuilding = this.building
        this.form.setFieldsValue({
          'name': this.building.name,
          'shortName': this.building.shortName
        })
        this.showClassrooms = true
        this.loadClassrooms()
      } else {
        this.form.setFieldsValue({
          'name': '',
          'shortName': ''
        })
        this.showClassrooms = false
      }
    },    

    methods:  {
      loadClassrooms() {
        this.classroomsLoading = true
        BuildingService.instance.getOne(this.currentBuilding!.id)
        .then(building=>{
          this.classrooms = building.classrooms!.map(element=>{
            return {
              deleting: false,
              classroom: element
            }
          })
        })
        .catch(e=>{
          notification['error']({
            message:"Ошибка загрузки списка аудиторий",
            description: e.message
          })
        })
        .finally(()=>{
          this.classroomsLoading = false
        })
      },

      onSubmit() {
        this.form.validateFields(errors=>{
          if(!errors) {
            if(this.currentBuilding) {
              this.edit()
            }
            else {
              this.create()
            }
          }
        })        
      },

      edit() {
        
        this.loading = true
        
        BuildingService.instance.edit(this.currentBuilding!.id, {
        
        name: this.getName(),
        
        shortName: this.getShortName()
        
        }).then(building=>{

          this.loading = false

          this.currentBuilding = building
          
          this.classrooms = building.classrooms ? building.classrooms!.map(element=>{
            return {
              deleting: false,
              classroom: element
            }
          }) : []

          notification['success']({
            message: 'Операция прошла успешно',
            description: `Данные о корпусе обновлены`
          })

          this.$emit('edited', building)
        
        }).catch( e => {

          this.loading = false
          
          notification['error']({
            message: 'Ошибка',
            description: e.message
          })

        })
      },

      create() {

        this.loading = true

        BuildingService.instance.create({
            name: this.getName(),
            shortName: this.getShortName()
        })
        .then(building=>{
            this.currentBuilding = building
            this.classrooms = building.classrooms ? building.classrooms!.map(element=>{
            return {
              deleting: false,
              classroom: element
            }
          }) : []
            this.showClassrooms = true
            notification['success']({
              message: "Операция прошла успешно",
              description: `${this.currentBuilding.name} добавлен в список корпусов`
            })
            this.$emit('created', building)
        })
        .catch( e => {

          this.loading = false
          
          notification['error']({
            message: 'Ошибка',
            description: e.message
          })
          
        })

      },

      onCancelButtonClick() {
        this.$emit("cancelButtonClick")
      },

      getName() : string {
        return this.form.getFieldValue('name')
      },

      getShortName() : string {
        return this.form.getFieldValue("shortName")
      },

      closeClassroomForm() {
        this.classroomFormOpened = false
      },

      openClassroomForm(classroom: Classroom) {
        this.editingClassroom = classroom
        this.classroomFormOpened = true
      },

      openClassroomCreationForm() {
        this.editingClassroom = null
        this.classroomFormOpened = true
      },

      onClassroomCreated(classroom: Classroom) {
        this.classrooms.push({
          deleting: false,
          classroom: classroom
        })
        this.closeClassroomForm()
      },

      onClassroomEdited(classroom: Classroom) {
        this.classrooms = this.classrooms.map(element=>{
          if(element.classroom.id === classroom.id) {
            return {
              deleting: false,
              classroom: classroom
            }
          } else {
            return element
          }
        })
        this.closeClassroomForm()
      },

      onClassroomListEditButtonClick(item: Item) {
        this.openClassroomForm(item.classroom)
      },

      onClassroomListDeleteButtonClick(item: Item) {
        this.classrooms = this.classrooms.map(element=>{
          if(element.classroom.id === item.classroom.id) {
            return {
              deleting: true,
              classroom: item.classroom
            }
          }
          return element
        })

        ClassroomService.instance.delete(item.classroom.id)
        .then(()=>{
          let index = this.classrooms.findIndex(el=>el.classroom.id === item.classroom.id)
          this.classrooms.splice(index,1)
        })
        .catch(e=>{
          notification['error']({
            message: 'Ошибка',
            description: e.message
          })
        })
      }
    }
})
</script>

<style scoped>
.classroom-list-container {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: auto;
  padding: 8px 24px;
  height: 300px;
}

.add-classroom-button-container {
  margin: 0px 0px 10px 0px;
}
</style>
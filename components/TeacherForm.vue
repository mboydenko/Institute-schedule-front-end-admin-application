<template>
    <div>
        <a-form :form="form" layout="vertical" :required="true" @submit.prevent="onSubmit">
            <a-form-item label="Фамилия" name="last-name">
                <a-input  
                placeholder="Введите фамилию" 
                v-decorator="[
                'lastNameField', { rules: [{ required: true, message: 'Пожалуйста, введите фамилию!' }] }]"/>
            </a-form-item> 
            <a-form-item label="Имя" name="first-name">
                <a-input 
                placeholder="Введите имя"
                v-decorator="[
                 'firstNameField', {rules: [{required: true, message: 'Пожалуйста, введите имя!'}]}
                ]"
                >
                </a-input>
            </a-form-item>
            <a-form-item label="Отчество" name="middleName"  >
                <a-input 
                placeholder="Введите отчество" 
                v-decorator="[
                 'middleNameField', {rules: [{required: true, message: 'Пожалуйста, введите отчетсов!'}]}
                ]"
                />
            </a-form-item> 
            <a-form-item label="Эл.почта" name="email">
                <a-input 
                placeholder="Введите электронную почту" 
                v-decorator="[
                 'emailField', {rules: [{required: true, message: 'Пожалуйста, введите электронную почту!'}]}
                ]"
                />
            </a-form-item>

            <a-form-item label="Кафедра" :required="true">
                <a-row>
                    <a-col :span="10" :style="{marginRight: '10px'}">
                        <a-select v-model="chairIdField">
                            <a-select-option :key="chair.id" :value="chair.id" v-for="chair of chairs">{{chair.abbreviation}}</a-select-option>
                        </a-select>
                    </a-col>
                    <span>
                        <a-button 
                        type="primary" 
                        @click="openChairCreationForm"
                        ><a-icon type="plus"></a-icon></a-button>
                    </span>
                    <span>
                        <a-divider v-if="chairIdField != 0" type="vertical"></a-divider>
                    </span>
                    <span :span="2">
                        <a-button 
                        type="primary" 
                        v-if="chairIdField != 0" @click="openChairEditFrom"><a-icon type="edit"></a-icon></a-button>
                    </span>
                </a-row>
                
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
    <a-drawer
    :width="'30%'"
    :title="formTitle"
    :visible="chairFromOpened" 
    @close="closeChairForm">
        <div v-if="chairFromOpened">
            <chair-form 
            :chair="editingChair" 
            v-if="editingChair != null"
            @created="onChairCreated"
            @edited="onChairEdited"
            />
            <chair-form 
            v-else
            @created="onChairCreated"
            @edited="onChairEdited"
            />
        </div>
    </a-drawer>
    </div>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import { WrappedFormUtils } from 'ant-design-vue/types/form/form'
import Vue from 'vue'
import Chair from '~/models/chair'
import Teacher from '~/models/teacher'
import ChairsService from '~/services/chairs/chairs.service'
import TeachersService from '~/services/teachers/teachers.service'

interface Data {
    loading: boolean
    chairIdField: number
    chairs: Chair[],
    form: WrappedFormUtils,
    chairFromOpened: boolean,
    editingChair: Chair | null,
    formTitle: string
}

export default Vue.extend({
    props: {
        teacher: {
            type: Object as ()=> Teacher | undefined, required: false
        }
    },
    data() : Data {
        return {
            loading: false,
            chairIdField: 0,
            chairs: [],
            form: this.$form.createForm(this),
            chairFromOpened: false,
            editingChair: null,
            formTitle: ""
        }
    },
    mounted() {
        this.loadChairs()
        if(this.teacher) {
            let teacher = this.teacher as Teacher
            this.form.setFieldsValue({
                'firstNameField' : teacher.firstName,
                'lastNameField': teacher.lastName,
                'middleNameField' : teacher.middleName,
                'emailField': teacher.email
            })
            this.chairIdField = teacher.chair.id
        } else {
            this.form.setFieldsValue({
                'firstNameField' : "",
                'lastNameField': "",
                'middleNameField' : "",
                'emailField': ""
            })
            this.chairIdField = 0
        }
    },
    methods: {
        
        loadChairs() {
            ChairsService.instance.all()
            .then(chairs=>{
                this.loading = false
                this.chairs = chairs
            })
            .catch(e=>{
                notification['error']({
                    message:"Ошибка загрузки списка кафедр",
                    description: e.message
                })
            })
        },
        
        onSubmit() {
            
            this.form.validateFields((errors)=>{
                if(!errors) {
                    if(this.teacher) {
                        this.editTeacher()
                    }
                    else {
                        this.createTeacher()
                    }
                }
            })

        },

        createTeacher() {
            this.loading = true
            TeachersService.instance.create({
                firstName: this.firstNameField(),
                lastName: this.lastNameField(),
                middleName: this.middleNameField(),
                email: this.emailField(),
                chairId: this.chairIdField == 0 ? 1 : this.chairIdField
            })
            .then(teacher=>{
                this.loading = false
                this.$emit('created',teacher)
            })
            .catch(e=>{
                this.loading = false
                notification['error']({
                    message: "Не удалось добавить преподавателя",
                    description: e.message
                })
            })
        },
        editTeacher() {
            this.loading = true
            if(this.teacher)
            TeachersService.instance.edit(
                this.teacher.id,
                {
                firstName: this.firstNameField(),
                lastName: this.lastNameField(),
                middleName: this.middleNameField(),
                email: this.emailField(),
                chairId: this.chairIdField == 0 ? 1 : this.chairIdField
            })
            .then(teacher=>{
                this.loading = false
                this.$emit('edited',teacher)
            })
            .catch(e=>{
                this.loading = false
                notification['error']({
                    message: "Не удалось обновить данные",
                    description: e.message
                })
            })
        },
        onCancelButtonClick() {
            this.$emit('cancelButtonClick');
        },

        firstNameField() : string {
            return this.form.getFieldValue('firstNameField')
        },
        
        lastNameField() :  string {
            return this.form.getFieldValue('lastNameField')
        },

        middleNameField() : string {
            return this.form.getFieldValue('middleNameField')
        },

        emailField() : string {
            return this.form.getFieldValue('emailField')
        },

        openChairCreationForm() {
            this.editingChair = null
            this.formTitle = "Добавить кафедру"
            this.chairFromOpened = true
        },

        openChairEditFrom() {
            let chair = this.chairs.find(el => el.id === this.chairIdField)
            if(!chair) throw Error("Chair not selected")
            this.editingChair = chair
            this.formTitle = chair.name
            this.chairFromOpened = true
        },

        closeChairForm() {
            this.chairFromOpened = false
        },

        onChairEdited(chair: Chair) {
            notification['success']({
                message:"Операция прошла успешно",
                description:"Данные обновлены"
            })
            this.chairs = this.chairs.map(el=>{
                if(el.id === chair.id) {
                    return chair
                }
                return el
            })
            this.editingChair = chair
            this.closeChairForm()
        },

        onChairCreated(chair: Chair) {
            this.chairs.push(chair)
            notification['success']({
                message:"Операция прошла успешно",
                description: `${chair.name} добавлена в список кафедр`
            })
            this.chairIdField = chair.id
            this.closeChairForm()
        }

    },
})
</script>

<style>

</style>
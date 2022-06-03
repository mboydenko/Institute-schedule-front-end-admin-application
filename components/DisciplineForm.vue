<template>
    <a-form :form="form" :required="true" @submit.prevent="onSubmit">
      <a-form-item label="Наименование">
          <a-input placeholder="Введите наименование"
          v-decorator="[
          'name',
          {
              rules: [
                {
                    required: true,
                    message: 'Обязательное поле'
                }
              ]
          }
          ]"
          ></a-input>
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
      <a-button type="primary" @click="onSubmit" :loading="loading">{{loading ? "Сохранение" : "Сохранить"}}</a-button>
    </div>
    </a-form>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import { WrappedFormUtils } from 'ant-design-vue/types/form/form'
import Vue from 'vue'
import Discipline from '~/models/discipline'
import DisciplinesService from '~/services/disciplines/disciplines.service'

interface Data {
    form: WrappedFormUtils,
    currentDiscipline?: Discipline,
    loading: boolean
}

export default Vue.extend({
    props: {
        discipline: {
            type: Object as () => Discipline,
            required: false
        }
    },

    data() : Data {
        return {
            form: this.$form.createForm(this),
            loading: false
        }
    },

    mounted() {
        if(!this.discipline) {
            this.form.setFieldsValue({
                'name': ''
            })
        }
        else {
            this.currentDiscipline = this.discipline
            this.form.setFieldsValue({
                'name': this.currentDiscipline.name
            })
        }
    },

    methods: {
        onSubmit() {
            if(this.currentDiscipline) {
                this.editDiscipline()
            } 
            else {
               this.createDiscipline() 
            }
        },

        createDiscipline() {
            this.loading = true
            DisciplinesService.instance.create({
                name: this.getName()
            })
            .then(discipline=>{
                this.loading = false
                this.currentDiscipline = discipline
                notification['success']({
                    message: "Операция прошла успешно",
                    description: `Добавлена дисциплина: ${discipline.name}`
                })
                this.$emit("created", this.currentDiscipline)
            })
            .catch(e=>{
                this.loading = false
                notification['error']({
                    message:"Ошибка",
                    description:e.message
                })
            })
        },

        editDiscipline() {
            this.loading = true
            DisciplinesService.instance.edit(this.currentDiscipline!.id, {
                name: this.getName()
            })
            .then(discipline=>{
                this.loading = false
                this.currentDiscipline = discipline
                notification['success']({
                    message: "Данные обновлены",
                    description: ''
                })
                this.$emit("edited", this.currentDiscipline)
            })
            .catch(e=>{
                this.loading = false
                notification['error']({
                    message:"Ошибка",
                    description:e.message
                })
            })
        },

        getName() : string{
            return this.form.getFieldValue('name')
        },

        onCancelButtonClick() {
            this.$emit('cancelButtonClick')
        }
    }
})

</script>

<style>

</style>
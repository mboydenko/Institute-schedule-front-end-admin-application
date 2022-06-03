<template>
  <a-form layout="vertical" :required="true" :form="form" @submit.prevent="onSubmit">
        <a-form-item label="Наименование">
            <a-input  
            placeholder="Введите наименование"
            v-decorator="[
            'groupName', {
                rules: [
                    {
                        required: true,
                        message: 'Введите наименование группы'
                    }
                ]
            }]"
            />
        </a-form-item> 
        <a-form-item label="Количество подгрупп" name="numberOfSubgroups">
            <a-input 
            placeholder="Введите количество подгрупп" 
            type="number"
            v-decorator="[
            'numberOfSubgroups', {
                rules: [
                    {
                        required: true,
                        message: 'Введите наименование группы'
                    }
                ]
            }]"
            >
            </a-input>
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
      <a-button type="primary" :loading="loading" htmlType="submit">{{loading ? "Сохранение" : "Сохранить"}}</a-button>
    </div>
    </a-form>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import { WrappedFormUtils } from 'ant-design-vue/types/form/form'
import Vue from 'vue'
import Group from '~/models/group'
import GroupService from '~/services/groups/groups.service'

interface Data {
    loading: boolean,
    form: WrappedFormUtils
}

export default Vue.extend({
    
    props: {
        group: {
            type: Object as ()=> Group | null,
            required: false
        }
    },

    data() : Data {
        return  {
            loading: false,
            form: this.$form.createForm(this)
        }
    },

    mounted() {
        if(this.group) {
            this.form.setFieldsValue({
                'groupName': this.group.name,
                'numberOfSubgroups' : this.group.numberOfSubgroups
            })
        } else {
            this.form.setFieldsValue({
                'groupName': '',
                'numberOfSubgroups' : 0
            })
        }
    },

    methods: {
        onSubmit() {
            this.form.validateFields((errors)=>{
                if(!errors) {
                    if(this.group) {
                        this.editGroup()
                    }
                    else {
                        this.createGroup()
                    }
                }
            })
        },
        
        onCancelButtonClick() {
            this.$emit('cancelButtonClick');
        },

        editGroup() {
            this.loading = true
            GroupService.instance.edit(
                this.group!.id,
                {
                    name: this.groupName(),
                    numberOfSubgroups: this.numberOfSubgroups()
                }
            )
            .then( group=> {
                this.loading = false
                this.$emit('edited', group)
            })
            .catch( e => {
                this.loading = false
                notification['error']({
                    message: 'Ошибка',
                    description: e.message
                })
            })
        },

        createGroup() {
            this.loading = true

            GroupService.instance.create({
                name: this.groupName(),
                numberOfSubgroups: this.numberOfSubgroups()
            })
            .then( group => {
                this.loading = false
                console.log("Created", group)
                this.$emit('created', group)
            })
            .catch(e => {
                this.loading = false
                notification['error']({
                    message: 'Ошибка',
                    description: e.message
                })
            })       
        },

        groupName() : string {
            return this.form.getFieldValue('groupName')
        },

        numberOfSubgroups() : number {
            return this.form.getFieldValue('numberOfSubgroups');
        }
    }
})
</script>

<style>

</style>
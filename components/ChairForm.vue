<template>
  <a-form layout="vertical" :required="true" :form="form" @submit.prevent="onSubmit">
        <a-row>
            <a-form-item label="Наименование">
                <a-input  
                    placeholder="Введите наименование"
                    v-decorator="[
                    'name', { 
                        rules: [
                            {
                                required: true, 
                                message: 'Введите наименование'
                            }
                        ]
                    }
                ]"
                ></a-input>
            </a-form-item> 
            <a-form-item label="Аббревиатура">
                <a-input 
                placeholder="Введите аббревиатуру" 
                v-decorator="[
                    'abbreviation', { 
                        rules: [ 
                            {
                                required: true, 
                                message: 'Введите аббревиатуру'
                            }
                        ]
                    }
                ]"
                ></a-input>
            </a-form-item>
        </a-row>
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
import Chair from '~/models/chair'
import ChairsService from '~/services/chairs/chairs.service'

interface Data {
    loading: boolean
    form: WrappedFormUtils
}

export default Vue.extend({
    props: {
        chair: {
            type: Object as () => Chair | null,
            required: false
        }
    },
    data() : Data {
        return {
            loading: false,
            form: this.$form.createForm(this)
        }
    },
    mounted() {
        if(this.chair) {
            this.form.setFieldsValue({
                'name': this.chair.name,
                'abbreviation': this.chair.abbreviation
            })

        } else {
            this.form.setFieldsValue({
                'name' : '',
                'abbreviation': ''
            })
        }
    },
    methods: {
        onSubmit() {
            this.form.validateFields((errors)=>{
                if(!errors) {
                    if(this.chair) {
                        this.editChair()
                    }
                    else {
                        this.createChair()
                    }
                }
            })
        },

        createChair() {
            this.loading = true

            ChairsService.instance.create({
                name: this.getName(),
                abbreviation: this.getAbbreviation()
            })
            .then(chair => {
                this.loading = false

                this.$emit('created', chair)
            })
            .catch( e => {
                this.loading = false

                notification['error']({
                    message: "Ошибка",
                    description: e.message
                })
            })
        },
        editChair() {

            let chair = this.chair as Chair
            
            this.loading = true

            ChairsService.instance.edit(
                chair.id,
                {
                    name: this.getName(),
                    abbreviation: this.getAbbreviation()
                }
            )
            .then(chair => {
                
                this.loading = false

                this.$emit('edited', chair)
            })
            .catch(e => {
                this.loading = false

                notification['error']({
                    message: "Ошибка",
                    description: e.message
                })
            })
        },

        onCancelButtonClick() {
            this.$emit('cancelButtonClick')
        },

        getName() : string {
            return this.form.getFieldValue('name')
        },

        getAbbreviation() : string{
            return this.form.getFieldValue('abbreviation')
        }
    }
})
</script>

<style>

</style>
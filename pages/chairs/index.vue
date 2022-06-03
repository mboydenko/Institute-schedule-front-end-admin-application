<template>
<div class="chairs-page">
    <a-button type="primary" @click="openCreationForm">Добавить кафедру</a-button>
    <chair-table 
    :chairs="chairs" 
    :loading="loading" 
    @editButtonClick="openChair"
    @deleteButtonClick="deleteChair"
    />
    <a-drawer 
    :title="formTitle"
    :width="'50%'"
    :visible="formOpened"
    @close="closeForm"
    >
        <span v-if="formOpened">
            <chair-form 
            v-if="editingChair != null" 
            :chair="editingChair"
            @created="onCreated"
            @edited="onEdited"
            @cancelButtonClick="onCancelButtonClick"
            />
            <chair-form 
            v-else
            @created="onCreated"
            @edited="onEdited"
            @cancelButtonClick="onCancelButtonClick"
            />
        </span>
    </a-drawer>
</div>
</template>

<script lang="ts">

import { notification, Table } from 'ant-design-vue'
import Vue from 'vue'
import ChairForm from '~/components/ChairForm.vue'
import ChairTable from '~/components/ChairTable.vue'
import Chair from '~/models/chair'
import ChairsService from '~/services/chairs/chairs.service'

interface DataInterface {
    // ListState
    chairs: Chair[],
    loading: boolean,


    // Form state
    formOpened: boolean,
    formTitle: string,
    editingChair: Chair | null
}


export default Vue.extend({
    components: { ChairForm, ChairTable },
    data() : DataInterface {
        return {
            chairs: [],
            loading: false,
            formOpened: false,
            editingChair: null,
            formTitle: "Добавить группу"
        }
    },

    mounted() {
        this.loadChairs()
    },

    methods: {
        loadChairs() {
            this.loading = true
            ChairsService.instance.all()
            .then(chairs=>{
                this.loading = false
                this.chairs = chairs
            })
            .catch(e => {
                this.loading = false
                notification['error']({
                    message:"Ошибка загрузки",
                    description: e.message
                })
            })
        },

        openChair(chair: Chair) {
            this.editingChair = chair
            this.formOpened = true
            this.formTitle = chair.name
        },

        openCreationForm() {
            this.formTitle = "Добавить кафедру"
            this.formOpened = true
            this.editingChair = null
        },
        
        closeForm() {
            this.editingChair = null
            this.formOpened = false
        },

        deleteChair(chair: Chair) {
            ChairsService.instance.delete(chair.id)
            .then((element)=>{
                this.chairs.splice(this.chairs.indexOf(chair), 1)
                notification['success']({
                    message:"Операция прошла успешно",
                    description:`${chair.name} удалена`
                })
            })
            .catch(e=>{
                notification['error']({
                    message:"Ошибка",
                    description:e.message
                })
            })
        },

        onCancelButtonClick() {
            this.closeForm()
        },

        onCreated(chair: Chair){
            this.chairs.push(chair)
            notification['success']({
                message:"Операция прошла успешно",
                description: `${chair.name} добавлена в список кафедр`
            })
            this.openChair(chair)
        },

        onEdited(chair: Chair) {
            notification['success']({
                message:"Данные обновлены",
                description:""
            })
            this.chairs = this.chairs.map(element=>{
                if(element.id === chair.id) {
                    return chair
                }
                return element
            })
             this.openChair(chair)
        }
    }
})

</script>

<style scoped>
.chairs-page {
    height: 100%;
}
.chairs-page__content-container {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
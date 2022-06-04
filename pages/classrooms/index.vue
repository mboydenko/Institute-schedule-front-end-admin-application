<template>
    <classroom-list :loading="loading" :classrooms="listItems"/>
</template>

<script lang="ts">

import { notification } from 'ant-design-vue'
import Vue from 'vue'
import Classroom from '~/models/classroom'
import ClassroomService from '~/services/classrooms/classroom.service'

import ClassroomList, { Item } from '~/components/ClassroomList.vue'

interface Data {
    listItems: Item[],
    loading: boolean
}

export default Vue.extend({

    components: {
        ClassroomList
    },

    data() : Data {
        return {
            loading: false,
            listItems: []
        }
    },

    mounted() {
        this.loadClassrooms()
    },

    methods: {
        loadClassrooms() {
            this.loading = true
            ClassroomService.instance.all()
            .then(classrooms=>{
                this.listItems = classrooms.map(element=>{
                    return {
                        deleting: false,
                        classroom: element
                    }
                })
            })
            .catch(e=>{
                notification['error']({
                    message: "Ошибка загрузки аудиторий",
                    description: e.message
                })
            })
            .finally(()=>{
                this.loading = false
            })
        }
    }
})

</script>

<style>

</style>
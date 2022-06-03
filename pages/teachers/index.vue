<template>
    <div class="teachers-page">
        
        <div class="add-teacher-button-container">
            <a-button type="primary" @click="openCreatingTeacherForm"><a-icon type="user-add"></a-icon>Добавить преподавателя</a-button>
        </div>

        <teacher-table 
        :teachers="teachers" 
        :loading="loading"
        @editButtonClick="openEditTeacherForm"
        @deleteButtonClick="deleteTeacher"
        />

        <a-drawer
        :title="formTitle"
        :width="'50%'"
        :visible="teacherFormOpened"
        @close="closeEditTeacherForm"
        >
        <div v-if="teacherFormOpened">
            <teacher-form
            :teacher="editingTeacher"
            @created="onTeacherCreated" 
            @edited="onTeacherEdited"
            @cancelButtonClick="closeEditTeacherForm"
            />        
        </div>
            <teacher-form 
            v-else
            @created="onTeacherCreated" 
            @edited="onTeacherEdited"
            @cancelButtonClick="closeEditTeacherForm"
            /> 
        </a-drawer>
    </div>

</template>

<script lang="ts">

import Vue from 'vue'

import Teacher from '~/models/teacher' 
import { notification } from 'ant-design-vue';
import TeacherService from '~/services/teachers/teachers.service'
import TeachersService from '~/services/teachers/teachers.service';
import CreateTeacherDto from '~/services/teachers/dto/create-teacher.dto';
import TeacherNotFoundException from '~/services/teachers/exceptions/teacher-not-found.exception';
import EmailNotAvailableException from '~/services/teachers/exceptions/email-not-available.exception';
import EditTeacherDto from '~/services/teachers/dto/edit-teacher.dto';
import TeacherForm from '~/components/TeacherForm.vue'
import TeacherTable from '~/components/TeacherTable.vue'

interface TableDataInterface {
    id: number,
    key: number,
    name: string,
    email: string,
    chair: string
}

interface DataInterface {
    teachers: Teacher[],
    loading: boolean,
    editingTeacher: Teacher | null,
    teacherFormOpened: boolean,
    formTitle: string,
    formLoading: boolean,
}

const columns = [
    {
        dataIndex:'name',
        key:'name',
        title:'Преподаватель'
    },
    {
        dataIndex:'email',
        key:'email',
        title: 'Электронная почта'
    },
    {
        title: "Кафедра",
        key: "chair",
        dataIndex: "chair"
    },
    {
        title: "Действия",
        key: 'action',
        scopedSlots: { customRender: 'action' }
    }
]

export default Vue.extend({ 
    components: {
        TeacherForm, TeacherTable
    },
    
    data() : DataInterface {   
        return {
            teachers: [],
            loading: true,
            formLoading: false,
            editingTeacher: null,
            teacherFormOpened: false,
            formTitle: "Новый преподаватель",
        }
    },
    beforeMount () {
        this.loading = true
        this.loadTeachers();
    },

    methods: {
        deleteTeacher(teacher: Teacher) {
            TeacherService.instance.delete(teacher.id)
            .then(teacher => {
                notification['success']({
                    message:"Преподаватель удален",
                    description:`${teacher.lastName} ${teacher.firstName} ${teacher.middleName} удален`
                });
                
                let currentTeacher = this.teachers.find(el => el.id === teacher.id);
                
                if(currentTeacher)
                    this.teachers.splice(this.teachers.indexOf(currentTeacher), 1)
            })
            .catch((e)=>{
                if( e instanceof TeacherNotFoundException) {
                    notification['error']({
                        message:"Ошибка удаления",
                        description: "Преподаватель не найден"
                    })
                } else {
                    notification['error']({
                        message:"Ошибка удаления",
                        description: e.message
                    })
                }
            })
        },
        
        openEditTeacherForm(teacher: Teacher) {
            this.editingTeacher = teacher
            this.formTitle = `${this.editingTeacher.lastName} ${this.editingTeacher.firstName} ${this.editingTeacher.middleName}`;
            this.teacherFormOpened = true
        },
        
        closeEditTeacherForm() {
            this.editingTeacher = null
            this.teacherFormOpened = false
        },  
        
        openCreatingTeacherForm() {
            this.editingTeacher = null
            this.formTitle = 'Новый преподаватель'
            this.teacherFormOpened = true
        },

        loadTeachers() {
            this.loading = true
            TeachersService.instance.all().then(teachers => {
                this.teachers.push(...teachers)
                this.loading = false;
            })
        },

        onTeacherCreated(teacher: Teacher) {
            notification['success']({
                message:"Операция прошла успешно",
                description: `${teacher.lastName} ${teacher.firstName} ${teacher.middleName} добавлен(а) в список преподавателей`
            })
            this.teachers.push(teacher)
            this.openEditTeacherForm(teacher)
        },

        onTeacherEdited(teacher: Teacher) {
            notification['success']({
                message: "Оперция прошла успешно",
                description: "Данные о преподавателе обновлены"
            })
            this.teachers = this.teachers.map( t => {
                if(t.id === teacher.id) {
                    return teacher
                }
                return t
            })
            this.openEditTeacherForm(teacher)
        }
    },
    computed: {
        columns(){
            return columns
        },
        locale() {
            return {
                emptyText: "Список пуст"
            }
        }
    }
})
</script>

<style scoped>

.form-button {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px
}

.add-teacher-button-container {
    margin: 10px 0px 10px 0px;
}
.teacher-table {
    height: 100%;
    background-color: white;
}
.table-row {
    background-color: white;
    
}
</style>
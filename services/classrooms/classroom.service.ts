import Classroom from "~/models/classroom"
import axios from "~/plugins/axios"
import ClassroomMapping from "./classroom.mapping"
import ApiClassroomDto from "./dto/api-classroom.dto"
import ApiCreateClassroomDto from "./dto/api-create-classroom.dto"
import ApiEditClassroomDto from "./dto/api-edit-classroom.dto"
import CreateClassroomDto from "./dto/create-classroom.dto"
import EditClassroomDto from "./dto/edit-classroom.dto"

export default class ClassroomService {

    private apiUrl: string = "http://localhost:8000/api/classrooms"

    private constructor() {}

    private static _instance: ClassroomService

    static get instance() : ClassroomService {
        if(!ClassroomService._instance) {
            ClassroomService._instance = new ClassroomService()
        }
        return ClassroomService._instance
    }

    async getOne(id: number) : Promise<Classroom> {
        let result: ApiClassroomDto = (await axios.get(`${this.apiUrl}/${id}`)).data
        
        return ClassroomMapping.fromApiOne(result)
    }

    async all() : Promise<Classroom[]> {
        
        let responseData: ApiClassroomDto[] = (await axios.get(`${this.apiUrl}`)).data

        return ClassroomMapping.fromApiMany(responseData) 
    }

    async create(data: CreateClassroomDto) : Promise<Classroom> {
        
        let apiData : ApiCreateClassroomDto = {
            building_id: data.buildingId,
            name: data.name
        }
        
        let responseData: ApiClassroomDto = (await axios.post(this.apiUrl, apiData)).data
        
        return ClassroomMapping.fromApiOne(responseData)
    }

    async edit(id: number, data: EditClassroomDto) : Promise<Classroom> {
        let apiData : ApiEditClassroomDto = {
            building_id: data.buildingId,
            name: data.name
        }

        let responseData : ApiClassroomDto = (await axios.put(`${this.apiUrl}/${id}`, apiData)).data
    
        return ClassroomMapping.fromApiOne(responseData)
    }

    async delete(id: number) : Promise<void> {
        await axios.delete(`${this.apiUrl}/${id}`)
    }
} 
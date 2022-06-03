import { AxiosError } from "axios"
import Group from "~/models/group"
import axios from "~/plugins/axios"
import ApiGroupDto from "./dto/api-group.dto"
import CreateGroupDto from "./dto/create-group.dto"
import GroupMapper from "./mappers/group.mapper"

export default class GroupService {
    private static _instance: GroupService

    private apiUrl: string = "http://localhost:8000/api/groups"

    private constructor () {}

    static get instance() : GroupService {
        if(!GroupService._instance) {
            GroupService._instance = new GroupService()
        }
        return GroupService._instance
    }

    async all() : Promise<Group[]>  {
        
        let result: ApiGroupDto[] = (await axios.get(`${this.apiUrl}`)).data
        
        return GroupMapper.fromApiList(result)
    }

    async getOne(id: number) : Promise<Group> {
        let result: ApiGroupDto = (await axios.get(`${this.apiUrl}/${id}`)).data
        
        return GroupMapper.fromApiOne(result)
    }

    async create(data: CreateGroupDto) : Promise<Group> {

        let apiData = GroupMapper.fromCreateDtoToApiCreateDto(data)

        try {
            let result: ApiGroupDto = (await axios.post(`${this.apiUrl}`, apiData)).data
        
            let group: Group = GroupMapper.fromApiOne(result)

            return group
        
        }catch(e: any) {
            if(e instanceof AxiosError) {
                let message = e.response?.data.detail ?? e.code
                throw new Error(message)
            }
            throw e
        }
        
        
    }

    async edit(id: number, data: CreateGroupDto) : Promise<Group> {
        
        try {
            let apiData = GroupMapper.fromEditDtoToApiEditDto(data)

            let apiGroup: ApiGroupDto = (await axios.put(`${this.apiUrl}/${id}`, apiData)).data

            let group: Group = GroupMapper.fromApiOne(apiGroup)
            
            return group
        }
        catch (e) {
            if(e instanceof AxiosError) {
                let message = e.response?.data.detail ?? e.code
                throw new Error(message)
            }
            throw e
        }
    }

    async delete(id: number) {
        await axios.delete(`${this.apiUrl}/${id}`)
    }
} 
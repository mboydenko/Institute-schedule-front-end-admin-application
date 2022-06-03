import Discipline from "~/models/discipline";
import axios from "~/plugins/axios";
import CreateDisciplineDto from "./dto/create-discipline.dto";
import EditDisciplineDto from "./dto/edit-discipline.dto";

export default class DisciplinesService {
    
    private static _instance: DisciplinesService;

    private apiUrl: string = "http://localhost:8000/api/disciplines"

    private constructor() {}

    static get instance() : DisciplinesService {
        if(!DisciplinesService._instance) {
            DisciplinesService._instance = new DisciplinesService()
        }
        return DisciplinesService._instance
    }

    async all() : Promise<Discipline[]>  {
        
        let result: Discipline[] = (await axios.get(this.apiUrl)).data
        
        return result
    }

    async getOne(id: number) : Promise<Discipline> {
        
        let result: Discipline = (await axios.get(`${this.apiUrl}/${id}`)).data

        return result
    }

    async create(data: CreateDisciplineDto) : Promise<Discipline> {

        let result: Discipline = (await axios.post(this.apiUrl, data)).data

        return result
    }

    async edit(id: number, data: EditDisciplineDto) : Promise<Discipline> {
        
        let result: Discipline = (await axios.put(`${this.apiUrl}/${id}`, data)).data

        return result
    }

    async delete(id: number) : Promise<void> {
        await axios.delete(`${this.apiUrl}/${id}`)
    }
}
import Chair from "~/models/chair";
import axios from "~/plugins/axios";
import Pause from "~/tools/pause";
import ApiChairDto from "./dto/api-chair.dto";
import CreateChairDto from "./dto/create-chair.dto";
import { EditChairDto } from "./dto/edit-chair.dto";
import ChairNotFoundException from "./exceptions/chair-not-found.exception";

export default class ChairsService {
    private apiUrl: string = "http://localhost:8000/api/chairs"

    private static _instance : ChairsService

    private constructor () {}

    private chairs: Chair[] =  []

    private counter: number = 0

    static get instance() : ChairsService {
        if(!ChairsService._instance) {
            ChairsService._instance = new ChairsService()
        }
        return ChairsService._instance;
    }
    
    async getOne(id: number) : Promise<Chair> {
        let chairApi: ApiChairDto = await axios.get(`${this.apiUrl}/${id}`)

        return {
            id: chairApi.id,
            name: chairApi.name,
            abbreviation: chairApi.abbreviation
        };
    }

    async all() : Promise<Chair[]> {
        let result: ApiChairDto[] = (await axios.get(`${this.apiUrl}`)).data

        let chairs: Chair[] = result.map(element=>{
            return element
        })

        return chairs
    }

    async create(data: CreateChairDto) : Promise<Chair>{
        let result : ApiChairDto = (await axios.post(`${this.apiUrl}`, data)).data

        return {
            id: result.id,
            abbreviation: result.abbreviation,
            name: result.name
        }
    }

    async edit(id: number, data: EditChairDto) : Promise<Chair> {
        let result : ApiChairDto = (await axios.put(`${this.apiUrl}/${id}`, data)).data

        return {
            id: result.id,
            abbreviation: result.abbreviation,
            name: result.name
        }
    }

    async delete(id: number) : Promise<Chair> {
       let result:ApiChairDto = await axios.delete(`${this.apiUrl}/${id}`)
       return result
    }
}
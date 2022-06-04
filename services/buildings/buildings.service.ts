import Building from "~/models/building";
import axios from "~/plugins/axios";
import Pause from "~/tools/pause";
import BuildingMapping from "./building.mapping";
import ApiBuildingDto from "./dto/api-building.dto";
import ApiCreateBuildingDto from "./dto/api-create-building.dto";
import ApiEditoBuildingDto from "./dto/api-edit-building.dto";
import CreateBuildingDto from "./dto/create-building.dto";
import EditBuildingDto from "./dto/edit-building.dto";

export default class BuildingService {
    private static _instance : BuildingService;

    private baseApiUrl: string = "http://localhost:8000/api/buildings"

    private constructor() {}

    static get instance() : BuildingService {
        if(!BuildingService._instance) {
            BuildingService._instance = new BuildingService()
        }
        return BuildingService._instance
    }

    async all() : Promise<Building[]> {
        
        let result: ApiBuildingDto[] = (await axios.get(this.baseApiUrl)).data
        
        return BuildingMapping.fromApiMany(result)
    }

    async getOne(id: number) : Promise<Building> {
        
        let result: ApiBuildingDto = (await axios.get(`${this.baseApiUrl}/${id}`)).data

        return BuildingMapping.fromApiOne(result)
    }

    async create(data: CreateBuildingDto) : Promise<Building> {
        let apiData : ApiCreateBuildingDto = {
            name: data.name,
            short_name: data.shortName
        }

        let result: ApiBuildingDto = (await axios.post(this.baseApiUrl, apiData)).data

        return BuildingMapping.fromApiOne(result)
    }

    async edit(id: number, data: EditBuildingDto) : Promise<Building> {
        let apiData : ApiEditoBuildingDto = {
            name: data.name,
            short_name: data.shortName
        }

        let result: ApiBuildingDto = (await axios.put(`${this.baseApiUrl}/${id}`, apiData)).data

        return BuildingMapping.fromApiOne(result)
    }

    async delete(id: number) : Promise<void> {
        await axios.delete(`this.baseApiUrl/${id}`)
    }
}
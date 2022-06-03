import Building from "~/models/building";
import ApiBuildingDto from "./dto/api-building.dto";

export default class BuildingMapping {
    private constructor (){}

    static fromApiOne(data: ApiBuildingDto) : Building {
        return {
            id: data.id,
            name: data.name,
            shortName: data.shot_name,
            classrooms: data.classrooms.map(element=>{
                return {
                    id: element.id,
                    name: element.name
                }
            })
        }
    }

    static fromApiMany(data: ApiBuildingDto[]) : Building[] {
        return data.map(element=>{
            return {
                id: element.id,
                name: element.name,
                shortName: element.shot_name
            }
        })
    }
}
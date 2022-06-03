import Classroom from "~/models/classroom";
import ApiClassroomDto from "./dto/api-classroom.dto";

export default class ClassroomMapping {
    static fromApiOne(data: ApiClassroomDto) : Classroom {
        return {
            id: data.id,
            name: data.name,
            building: {
                classrooms: [],
                id: data.building.id,
                name: data.building.name,
                shortName: data.building.short_name
            }
        }
    }

    static fromApiMany(data: ApiClassroomDto[]) : Classroom[] {
        return data.map(element=>{
            return this.fromApiOne(element)
        })
    }
}
import Classroom from "~/models/classroom"

interface ApiClassroom {
    id: number,
    name: string
}

export default interface ApiBuildingDto {
    id: number
    name: string
    shot_name:string
    classrooms: ApiClassroom []
}
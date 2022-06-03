import Classroom from "./classroom"

export default interface Building {
    id: number
    name: string
    shortName: string
    classrooms?: Classroom[]
}
import Teacher from "./teacher"
import Group from "./group"
import Time from "./time"
import Date from "./date"
import Building from "./building"
import Classroom from "./classroom"
import Discipline from "./discipline"

export default interface Credit {
    id: number,
    teacher:Teacher
    discipline: Discipline
    group:Group
    date: Date
    time: Time
    building: Building
    classroom: Classroom
    subgroup_number: number
}
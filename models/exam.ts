import Teacher from "./teacher"
import Group from "./group"
import Time from "./time"
import Date from "./date"
import Building from "./building"
import Classroom from "./classroom"
import Discipline from "./discipline"

export default interface Exam {
    id: number
    discipline: Discipline
    teacher:Teacher
    group:Group
    date: Date
    time: Time
    building: Building
    classroom: Classroom
}
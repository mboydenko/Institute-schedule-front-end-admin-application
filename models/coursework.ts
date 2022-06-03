import Teacher from "./teacher"
import Date from "./date"
import Time from "./time"
import Group from "./group"
import Discipline from "./discipline"
import Building from './building'
import Classroom from './classroom'

export default interface Coursework {
    id: number
    discipline: Discipline
    group: Group
    commissionMembers: Teacher[]
    date: Date
    time: Time
    building: Building
    classroom: Classroom
}
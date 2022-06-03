import Teacher from './teacher'
import Group from './group'
import Discipline from './discipline'
import Building from './building'
import Classroom from './classroom'
import Date from './date'
import Time from './time'
import { WeekType } from './week'

export enum LessonType {
    practice,
    laboratoryWork,
    lecture
}

export default interface Lesson {
    id: number
    group: Group
    teacher: Teacher
    discipline: Discipline
    type: LessonType
    number: number
    subgroup_number:number
    weekType: WeekType
    begin: Date
    end: Date
    building: Building
    classroom: Classroom
}
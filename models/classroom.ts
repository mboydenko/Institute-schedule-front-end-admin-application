import Building from './building'

export default interface Classroom {
    id: number
    name: string,
    building?: Building
}
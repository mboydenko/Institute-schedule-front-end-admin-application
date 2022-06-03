export default interface ApiTeacherDto {
    id: number
    first_name: string
    last_name: string
    middle_name: string
    email: string
    chair : {
        id: number
        name: string
        abbreviation: string
    }
}
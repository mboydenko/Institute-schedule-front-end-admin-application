import Chair from "./chair"

export interface ConstructorParams {
    id?: number
    lastName: string
    firstName: string
    middleName: string
    email: string
    chair: Chair
}

export default class Teacher {
    id: number
    lastName: string
    firstName: string
    middleName: string
    email: string
    chair: Chair

    constructor(params: ConstructorParams) {
       this.id = params.id ?? 0
       this.lastName = params.lastName
       this.middleName = params.middleName
       this.email = params.email
       this.chair = params.chair
       this.firstName = params.firstName
    }
}
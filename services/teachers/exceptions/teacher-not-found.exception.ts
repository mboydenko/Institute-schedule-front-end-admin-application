export default class TeacherNotFoundException extends Error {
    constructor() {
        super("Teacher not found")
    }
}
export default class DisciplineNotFoundException extends Error {
    constructor() { super("Discipline not found") }
}
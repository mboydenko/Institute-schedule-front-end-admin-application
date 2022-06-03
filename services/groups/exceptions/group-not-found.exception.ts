export default class GroupNotFoundException extends Error {
    constructor ()  { super("Group not found") }
}
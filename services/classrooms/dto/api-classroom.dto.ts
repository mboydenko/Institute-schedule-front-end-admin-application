interface ApiBuildingInterface {
    id: number
    name: string
    short_name: string
}

export default interface ApiClassroomDto {
    id: number,
    name: string,
    building: ApiBuildingInterface
}
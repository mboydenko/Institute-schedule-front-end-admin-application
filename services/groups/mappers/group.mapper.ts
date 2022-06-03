import Group from "~/models/group";
import ApiCreateGroupDto from "../dto/api-create-group.dto";
import ApiEditGroupDto from "../dto/api-edit-group.dto";
import ApiGroupDto from "../dto/api-group.dto";
import CreateGroupDto from "../dto/create-group.dto";
import EditGroupDto from "../dto/edit-group.dto";

export default class GroupMapper {
    static fromApiList(data: ApiGroupDto[]) : Group[] {
        const groups: Group[] = data.map(apiGroup=>{
            let group = new Group()
            group.id = apiGroup.id
            group.name = apiGroup.name
            group.numberOfSubgroups = apiGroup.number_of_subgroups
            return group
        })
        return groups
    }

    static fromApiOne(data:ApiGroupDto) : Group {
        const group = new Group()
        group.id = data.id
        group.name = data.name
        group.numberOfSubgroups = data.number_of_subgroups
        return group
    }

    static fromCreateDtoToApiCreateDto(data: CreateGroupDto) : ApiCreateGroupDto  {
        return {
            name: data.name,
            number_of_subgroups: data.numberOfSubgroups
        }
    }

    static fromEditDtoToApiEditDto(data: EditGroupDto) : ApiEditGroupDto  {
        return {
            name: data.name,
            number_of_subgroups: data.numberOfSubgroups
        }
    }
}
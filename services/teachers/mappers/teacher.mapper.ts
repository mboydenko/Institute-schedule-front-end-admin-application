import Teacher from "~/models/teacher";
import ApiCreateTeacherDto from "../dto/api-create-teacher.dto";
import ApiEditTeacherDto from "../dto/api-edit-teacher.dto";
import ApiTeacherDto from "../dto/api-teacher-dto";
import CreateTeacherDto from "../dto/create-teacher.dto";
import EditTeacherDto from "../dto/edit-teacher.dto";

export class TeacherMapper {
    private constructor () {}

    static fromApiList(data: ApiTeacherDto[]) : Teacher[] {
        return data.map((element)=>{
            return {
                id: element.id,
                lastName: element.last_name,
                firstName: element.first_name,
                middleName:element.middle_name,
                chair: element.chair,
                email: element.email
            }
        })
    }

    static fromApiOne(data: ApiTeacherDto) : Teacher {
        let teacher : Teacher = {
            id: data.id,
            lastName: data.last_name,
            firstName: data.first_name,
            middleName:data.middle_name,
            chair: data.chair,
            email: data.email
        }
        return teacher
    }

    static fromCreateDtoToApiCreateDto(data:CreateTeacherDto) : ApiCreateTeacherDto {
        return {
            chair_id: data.chairId,
            first_name: data.firstName,
            middle_name: data.middleName,
            last_name: data.lastName,
            email: data.email
        }
    }

    static fromEditDtoToApiEditDto(data: EditTeacherDto) : ApiEditTeacherDto {
        return {
            chair_id: data.chairId,
            first_name: data.firstName,
            middle_name: data.middleName,
            last_name: data.lastName,
            email: data.email
        }
    }
}
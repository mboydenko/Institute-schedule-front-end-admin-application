import CreateTeacherDto from "~/services/teachers/dto/create-teacher.dto";
import EditTeacherDto from "~/services/teachers/dto/edit-teacher.dto";
import Teacher from "~/models/teacher";
import TeacherNotFoundException from "./exceptions/teacher-not-found.exception";
import EmailNotAvailableException from "./exceptions/email-not-available.exception";
import Pause from "~/tools/pause";
import axios from "~/plugins/axios";
import ApiTeacherDto from "./dto/api-teacher-dto";
import { TeacherMapper } from "./mappers/teacher.mapper";

export default class TeachersService {
    // private apiUrl  = process.BaseUrl + '/api/infrasturecture/teachers/'

    private apiUrl = 'http://localhost:8000/api/teachers';

    private static _instance: TeachersService;
    

    private constructor() {}

    static get instance() : TeachersService {
        if(!TeachersService._instance) {
            TeachersService._instance = new TeachersService()
        }
        return TeachersService._instance
    }
 
    async all() : Promise<Teacher[]> {
        
        let result: ApiTeacherDto[] = (await axios.get(`${this.apiUrl}`)).data
        
        return TeacherMapper.fromApiList(result);
    }

    async getOne(id: number) : Promise<Teacher> {
        let result : ApiTeacherDto = await axios.get(`${this.apiUrl}/${id}`)
        
        return TeacherMapper.fromApiOne(result)
    }
    
    async create(data: CreateTeacherDto) : Promise<Teacher> {   
        
        let teacherApi: ApiTeacherDto = (await axios.post(
            `${this.apiUrl}`, 
            TeacherMapper.fromCreateDtoToApiCreateDto(data)
        )).data

        let teacher = TeacherMapper.fromApiOne(teacherApi)

        return teacher;

    }

    async edit(id: number, data: EditTeacherDto) : Promise<Teacher>{

        let teacherApi : ApiTeacherDto = (await axios.put(
            `${this.apiUrl}/${id}`,
            TeacherMapper.fromEditDtoToApiEditDto(data)
        )).data

        let teacher = TeacherMapper.fromApiOne(teacherApi)

        return teacher;
    }

    async delete(id: number) : Promise<Teacher> {
        let teacherApi: ApiTeacherDto = (await axios.delete(`${this.apiUrl}/${id}`)).data
        
        let teacher = TeacherMapper.fromApiOne(teacherApi)

        teacher = {
            ...teacher,
            id: id,
        }

        return teacher
    }
}
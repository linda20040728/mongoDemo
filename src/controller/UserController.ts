import { Contorller } from "../abstract/Contorller";
import { Request, Response } from "express";
import { UserService } from "../Service/UserService";
import { resp } from "../utils/resp";
import { DBResp } from "../interfaces/DBResp";
import { Student } from "../interfaces/Student";

export class UserController extends Contorller {
    protected service: UserService;

    constructor() {
        super();
        this.service = new UserService();
    }

    public async findAll(Request: Request, Response: Response) {
        const res: resp<Array<DBResp<Student>> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        const dbResp = await this.service.getAllStudents();
        if (dbResp) {
            res.body = dbResp;
            res.message = "find success";
            Response.send(res);
        } else {
            res.code = 500;
            res.message = "server error";
            Response.status(500).send(res);
        }
    }

    public async getOne(Request: Request, Response: Response) {
        const res: resp<DBResp<Student> | undefined> = {
            code: 200,
            message: "",
            body: undefined
        };

        const studentId = Request.params.id;

        try {
            const student = await this.service.getStudentById(studentId);

            if (student) {
                res.body = student.body; // `student.body` 包含學生的資料
                res.message = "Student found";
                Response.send(res);
            } else {
                res.code = 404;
                res.message = "Student not found";
                Response.status(404).send(res);
            }
        } catch (error) {
            res.code = 500;
            res.message = "Server error";
            Response.status(500).send(res);
        }
    }

    public async insertOne(Request: Request, Response: Response) {
        const resp = await this.service.insertOne(Request.body);
        Response.status(resp.code).send(resp);
    }

    public async deleteById(Request: Request, Response: Response) {
        const resp = await this.service.deleteById(Request.query.id as string);
        Response.status(resp.code).send(resp);
    }

    public async updateNameByID(Request: Request, Response: Response) {
        const resp = await this.service.updateNameByID(Request.body.id, Request.body.name);
        Response.status(resp.code).send(resp);
    }
}

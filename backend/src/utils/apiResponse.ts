class ApiResponse<T = unknown>{
        statusCode:number;
        data:T|null;
        message:string;
        success:boolean;
    constructor(
        statusCode:number,
        data:T|null,
        message:string
    ){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }

    static ok<T>(data:T, message='OK'){
        return new ApiResponse<T>(200,data,message)
    }

    static created<T>(data:T, message='Created'){
        return new ApiResponse<T>(201,data,message);
    }

    static error(status=400,message='Error'){
        return new ApiResponse<null>(status,null,message);
    }
}
export default ApiResponse;
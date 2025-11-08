export interface ApiResponse<T>{
    statusCode?:number;
    success:boolean;
    message:string;
    data?: T | null
}

export interface ApiError{
    statusCode?:number;
    message?:string;
    errors?:Array<string>;
    success?:boolean
}
type DefaultResponse = {
    success:boolean,
    message:string,
    error?:object
}

type RegisterResponseData = {
     _id:string,
    fullname:string,
    email:string,
    dob:string,
    purpose?:string,
    gender:string
}

type RegisterResponse = {
    success:boolean,
    message:string,
    userData:RegisterResponseData
}

type LoginResponseData = {
    _id:string,
    fullname:string,
    email:string,
    dob:string,
    purpose?:string,
    gender:string
}

type LoginResponse = {
    success:boolean,
    message:string,
    userDetails:LoginResponseData,
    token:string
}
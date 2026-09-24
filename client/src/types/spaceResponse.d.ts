export type spaceProps = {
    _id:string,
    name:string
    ownerUser:string,
    isPersonal:boolean,
    createdAt:string,
    updatedAt:string,
    __v:number
}

type spaceResponseProps =  {
    success:boolean,
    message:string,
    space:spaceProps[]
}
export type spaceProps = {
    _id:string,
    name:string
    ownerUser:string,
    isPersonal:boolean,
    purpose: string,
    createdAt:string,
    updatedAt:string,
    __v:number
}

type spaceResponseProps =  {
    success:boolean,
    message:string,
    space:spaceProps[]
}

type createSpaceProps = {
    success:boolean,
    message:string,
    newSpace:spaceProps[]
}

type spaceDataProps = {
    name:string,
    purpose?:string,
}
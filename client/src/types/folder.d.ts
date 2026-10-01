import type { DocumentResponse } from "./documentResponse"

type folderDataProps = {
    name:string,
    spaceId:string | undefined
}

type folderResponseProps = {
    name:string,
    ownerUser:string,
    space:string,
    _id:string,
    createdAt:string,
    updatedAt:string,
    __v:number
}

type apiFolderResponse = {
    success:boolean,
    message:string,
    newFolder:folderResponseProps
}

type getFolderResponse = {
    success:boolean,
    message:string,
    folders:folderResponseProps[]
}

type getDocumentsFolder = {
    success:boolean,
    message:string,
    document:DocumentResponse[]
}

type getSingleFolderResponse = {
    success:boolean,
    message:string,
    folder:folderResponseProps
}

import type { Descendant } from "slate"
import type { DocumentMargins, DocumentOrientation, PageSizes } from "./documentSetting"
import type { folderResponseProps } from "./folder"

type Collaborators = {
    user:string,
    role:string
}

type Settings = {
    pageSize:PageSizes,
    orientation:DocumentOrientation,
    margin:DocumentMargins
}

type OwnerUser = {
    _id:string,
    fullname:string,
    email:string
}

type DocumentResponse = {
    _id:string,
    name:string,
    description?:string,
    content:Descendant[],
    settings:Settings,
    createdAt:string,
    collaborators:Collaborators,
    ownerUser:OwnerUser,
    folder:folderResponseProps,
    isTrash:boolean,
    trashDate:string,
    updatedAt:string,
    lastEditedBy:string
}

export type createDocumentResponse = {
    success:boolean,
    message:string,
    newDocument:DocumentResponse
   
}

export type singleDocumentResponse = {
    success:boolean,
    message:string,
    singleDocument:DocumentResponse
}

export type allDocumentResponse = {
    success:boolean,
    message:string,
    allDocument:DocumentResponse[]
}

export type upadateDocumentResponse = {
    success:string,
    message:string,
    values?:Descendant[],
    updatedDocument:DocumentResponse[]
}

export type deleteDocumentResponse = {
    success:string,
    message:string,
    deletedData:DocumentResponse[]
}
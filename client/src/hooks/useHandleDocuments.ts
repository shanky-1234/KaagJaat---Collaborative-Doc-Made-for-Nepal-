import { documentHandler } from "@/services/documentHandler";
import { useAppSelector } from "./reduxHooks";
import { useState } from "react";
import type { DocumentResponse } from "@/types/documentResponse";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export function UseHandleDocuments () {
    const navigate = useNavigate()
     const [userDocuments, setUserDocument] = useState<DocumentResponse[]>([]);

     const currentSpace = useAppSelector((state)=>state.space.currentSpace)

    const getAllDocument = async () => {
          if (!currentSpace?._id) return;
        try {
         
          const response = await documentHandler.getAllDocuments(currentSpace?._id);
          if (response.success) {
            setUserDocument(response?.allDocument);
          }
        } catch (error) {
          console.error(error);
          toast.error(`${error}`);
        }
      };

      const handleCreateDocument = async () => {
          try {
            const response = await documentHandler.createDocument(currentSpace?._id);
            if (response.success) {
              navigate(`/documents/n/${response?.newDocument._id}`);
            }
          } catch (error) {
            console.error(error);
            toast.error(`${error}`);
          }
        };

    const handleDocumentRouting = (id: string) => {
        navigate(`/documents/n/${id}`);
      };
    
      const handleDocumentDelete = async (e: any, id: string) => {
        try {
          e.stopPropagation();
          const response = await documentHandler.deleteDocument(id);
          if (response.success) {
            toast.success("Document Moved to Trash")
            getAllDocument();
           
          }
        } catch (error) {
          console.error(error);
          toast.error(`${error}`);
        }
      };

      return {
        handleCreateDocument,
        getAllDocument,
        handleDocumentRouting,
        handleDocumentDelete,
        userDocuments,
        currentSpace
      }
}
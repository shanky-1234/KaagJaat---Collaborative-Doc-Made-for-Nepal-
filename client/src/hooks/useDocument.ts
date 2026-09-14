import { documentHandler } from "@/services/documentHandler";
import type{ PageSizes,DocumentOrientation, DocumentMargins, DocumentSettingType } from "@/types/documentSetting";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import type { Descendant } from "slate";

function useDocument({id,setSavingState}: {id:string | undefined,setSavingState:any}) {
  const navigate = useNavigate();

  const defaultContent: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<Descendant[]>(defaultContent);
  const [loading, setLoading] = useState<boolean>(false);
  const [settingsLoaded, setSettingsLoaded] = useState<boolean>(false);

  const [orientation,setOrientation] = useState<DocumentOrientation>('portrait')
  const [pageSize,setPageSize] = useState<PageSizes>("A4")
  const [documentMargin,setDocumentMargin] = useState<DocumentMargins>({
    top:20,
    left:20,
    right:20,
    bottom:20
  })


  const fetchDocument = async (id: string) => {
    setLoading(true);
    setSettingsLoaded(false)

    try {
      const response = await documentHandler.getSingleDocument(id);
      const savedSettings = response?.singleDocument.settings
      console.log(response);
      setTitle(response?.singleDocument.name);
      setContent(response?.singleDocument.content);
       if (savedSettings) {
      setPageSize(savedSettings.pageSize ?? "A4");
      setOrientation(savedSettings.orientation ?? "portrait");

      if (savedSettings.margin) {
        setDocumentMargin({
          top: Number(savedSettings.margin.top ),
          left: Number(savedSettings.margin.left ),
          right: Number(savedSettings.margin.right ),
          bottom: Number(savedSettings.margin.bottom),
        });
      }
    }

    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    } finally {
      setLoading(false);
      setSettingsLoaded(true)
    }
  };

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    fetchDocument(id);
  }, [id]);

  const updateDocument = async (name:string,content?:Descendant[],settings?:DocumentSettingType) => {
      setSavingState("saving")
    try {
      if (!id) {
        toast.error("Document id is missing");
        setSavingState("error")
        return;
      }
      const response = await documentHandler.updateDocument(id, {
        name,
        content,
        settings
      });
      if (response.success) {
        setSavingState("saved")
        console.log("saved");

      }
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
      setSavingState("error")
    } 
  };

  return {
    title,
    setTitle,
    loading,
    setLoading,
    content,
    setContent,
    updateDocument,
    orientation,
    setOrientation,
    pageSize,
    setPageSize,
    documentMargin,
    setDocumentMargin,
    settingsLoaded,
    setSettingsLoaded
  };
}

export default useDocument;

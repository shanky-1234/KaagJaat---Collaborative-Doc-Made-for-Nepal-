import { useEffect, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useAppSelector } from "#hooks/reduxHooks";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DocumentCard from "#components/dashboardCards/DocumentCard";
import DocumentCardList from "#components/dashboardCards/DocumentCardList";
import { Tabs, TabsList, TabsTrigger } from "#components/ui/tabs";
import { Button } from "#components/ui/button";
import { FileText, Grid3X3, List, ListFilter, Plus } from "lucide-react";
import DashboardHero from "#components/dashboard/DashboardHero";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select";
import { UseHandleDocuments } from "#hooks/useHandleDocuments";
import { folderService } from "@/services/folderHandler";
import FolderCard from "#components/dashboardCards/FolderCard";
import FolderCardList from "#components/dashboardCards/FolderCardList";
import { useNavigate } from "react-router";
import type { folderResponseProps } from "@/types/folder";
import { documentHandler } from "@/services/documentHandler";

 const options = [
    {
      label: "Recent Documents",
      value: "recentDoc",
    },
    {
      label: "Shared With Me",
      value: "sharedWithMe",
    },
    {
      label: "My Folders",
      value: "myFolder",
    },
  ];

function DashboardHome() {
  const navigate = useNavigate()

  const [loading,setLoading] = useState<boolean>(false)
  const [name,setName]=useState<string>('')
  const [active, setActive] = useState<string>("recentDoc");
  const [sortBy, setSortby] = useState<string>("latest")
  const [documentView, setDocumentView] = useState<"grid" | "list">("grid");
  const [folderView, setFolderView] = useState<"grid" | "list">("grid");

  const [folders,setFolders] = useState<folderResponseProps[]>()

  const { userData } = useAppSelector((state) => state.auth);

  const { handleCreateDocument,
        getAllDocument,
        handleDocumentRouting,
        handleDocumentDelete,
        userDocuments,
      currentSpace} = UseHandleDocuments()

  const sortedDocuments = [...userDocuments].sort((a,b)=>{
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()

      if (sortBy === "earliest") {
    return dateA - dateB;
  }

  return dateB - dateA;

  })

  useEffect(() => {
     if (!currentSpace?._id) return;
    getAllDocument();
    console.log(userDocuments)
    let isActive = true;

    folderService.getFolder(currentSpace._id)
      .then((response) => {
        if (isActive && response.success) setFolders(response.folders);
      })
      .catch(console.error);

    return () => {
      isActive = false;
    };
    // getAllDocument is supplied by the dashboard document hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSpace?._id]);

  const handleFolderOpen = (id:string)=>{
    navigate(`/myFolder/${id}`)
  }

  const handleMoveToFolder = async({documentId,folderId} : {documentId:string,folderId:string | null}) =>{
    setLoading(true)
    try {
      const response = await documentHandler.moveDocument(documentId,folderId)
      if (response.success) {
          toast.success(`Successfully Moved to`)
          getAllDocument()
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

    const handleRenameFolder = async (folderId:string, newName:string) =>{
    try {
        const response = await folderService.renameFolder({name:newName,folderId})
        if (response.success){
            toast.success("Successfully Renamed Folder")
            setFolders((prev)=>prev?.map((folder)=>folder._id === folderId ? {...folder,name:newName} : folder))
        }
    } catch (error) {
        console.error(error)
    }
  }
  return (
    <main className="mt-8 mx-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <section className="relative -z-20 rounded-3xl overflow-hidden mb-10">
        <DashboardHero username={userData?.fullname} />
      </section>
      <section className="mt-4 gap-4 mb-6">
        <div className="flex items-center justify-between w-full mb-4">
          <h2>My Workspace</h2>
          <div className="space-x-2">
            <Button
              className="bg-primary text-white min-h-12 cursor-pointer"
              onClick={handleCreateDocument}
            >
              <div className="flex gap-2 items-center">
                <span>New Document</span>
                <Plus />
              </div>
            </Button>

            <Button
              variant="outline"
              className="border-primary text-primary min-h-12 cursor-pointer"
            >
              <div className="flex gap-2 items-center">
                <span>Import Document</span>
                <FileText />
              </div>
            </Button>
          </div>
        </div>
        <div className="flex w-full justify-between items-center">
          <Tabs value={active} onValueChange={setActive}>
            <TabsList variant="line">
              {options.map((option) => (
                <TabsTrigger
                  key={option.value}
                  value={option.value}
                  className="
    z-0
    rounded-none
    text-xl
    text-neutral-500
    data-[state=active]:text-primary
    data-[state=active]:border-b-2
    data-[state=active]:border-b-primary
  "
                >
                  <span className="text-xl cursor-pointer">{option.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="flex items-center gap-2">
          {(active === "recentDoc" || active === "myFolder") && (
            <div className="flex rounded-lg bg-neutral-100 p-1" aria-label={`${active === "myFolder" ? "Folder" : "Document"} view`}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Grid view"
                aria-pressed={(active === "myFolder" ? folderView : documentView) === "grid"}
                onClick={() => active === "myFolder" ? setFolderView("grid") : setDocumentView("grid")}
                className={`h-8 w-8 cursor-pointer ${(active === "myFolder" ? folderView : documentView) === "grid" ? "bg-white text-primary shadow-sm" : "text-neutral-500"}`}
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="List view"
                aria-pressed={(active === "myFolder" ? folderView : documentView) === "list"}
                onClick={() => active === "myFolder" ? setFolderView("list") : setDocumentView("list")}
                className={`h-8 w-8 cursor-pointer ${(active === "myFolder" ? folderView : documentView) === "list" ? "bg-white text-primary shadow-sm" : "text-neutral-500"}`}
              >
                <List size={16} />
              </Button>
            </div>
          )}
          <Select defaultValue={sortBy} onValueChange={setSortby}>
            <SelectTrigger
              className="
                w-fit
                border
                bg-neutral-200
                border-0
                focus:border-neutral-400!
                focus-visible:border-neutral-400!
                focus-visible:ring-0
                data-[state=open]:border-neutral-400!
              "
            >
              <div className="flex gap-2 items-center p-2 rounded-xl">
              <ListFilter size={14}/>
              <SelectValue/>
              </div>
            </SelectTrigger>
            <SelectContent 
             position="popper"
        side="bottom"
        align="start"
        className="
          bg-white
          !border-neutral-400
          !ring-0
          !outline-none
        ">
              <SelectItem value="latest">
                By Latest Edited
              </SelectItem>
              <SelectItem value="earliest">
                By Earliest Edited
              </SelectItem>
            </SelectContent>
          </Select>
          </div>
        </div>
      </section>

      <section>
        {active === "recentDoc" && (
          documentView === "list" ? (
            <div className="flex flex-col gap-3">
              {sortedDocuments.map((document) => (
                <DocumentCardList
                  key={document._id}
                  title={document.name}
                  content={document.content}
                  author={document.ownerUser.fullname}
                  date={document.updatedAt}
                  onClick={() => handleDocumentRouting(document._id)}
                  onClickDelete={(e: ReactMouseEvent<HTMLDivElement>) =>
                    handleDocumentDelete(e, document._id)
                  }

                />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {sortedDocuments.map((document) => (
                <DocumentCard
                  key={document._id}
                  title={document.name}
                  content={document.content}
                  author={document.ownerUser.fullname}
                  date={document.updatedAt}
                  folder={document.folder}
                  folders={folders}
                  onMoveToFolder={(folderId)=>handleMoveToFolder({documentId:document._id,
                    folderId
                  })}
                  onClick={() => handleDocumentRouting(document._id)}
                  onClickDelete={(e: ReactMouseEvent<HTMLDivElement>) =>
                    handleDocumentDelete(e, document._id)
                  }
                  
                />
              ))}
            </div>
          )
        )}
        {active === "sharedWithMe" && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
            Nothing Shared With Right Now
          </div>
        )}
        {active === "myFolder" && (
          folders?.length ? (
            folderView === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {folders.map((folder) => (
                  <FolderCard
                    key={folder._id}
                    title={folder.name}
                    date={folder.updatedAt}
                    onClick={()=>handleFolderOpen(folder._id)}
                    onRename={(newName)=>handleRenameFolder(folder._id,newName)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {folders.map((folder) => (
                  <FolderCardList
                    key={folder._id}
                    title={folder.name}
                    date={folder.updatedAt}
                    onClick={()=>handleFolderOpen(folder._id)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="rounded-xl border border-dashed border-neutral-300 p-8 text-center text-neutral-500">
              No folders created yet.
            </div>
          )
        )}
      </section>
    </main>
  );
}

export default DashboardHome;

import DashboardCardCreate from "#components/dashboard/DashboardCardCreate";
import React, { useEffect, useState } from "react";
import notepage from "../../assets/elements/notepage.svg";
import folder from "../../assets/elements/foldericon.svg";
import { useNavigate } from "react-router";
import { useAppSelector } from "#hooks/reduxHooks";
import { documentHandler } from "@/services/documentHandler";
import { Bounce, toast, ToastContainer } from "react-toastify";
import DocumentCard from "#components/dashboardCards/DocumentCard";
import type { DocumentResponse } from "@/types/documentResponse";
import morningArt from "../../assets/headerElements/morning.png";
import { Tabs, TabsList, TabsTrigger } from "#components/ui/tabs";
import { Button } from "#components/ui/button";
import { FileText, ListFilter, Plus } from "lucide-react";
import DashboardHero from "#components/dashboard/DashboardHero";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "#components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger } from "#components/ui/select";

function DashboardHome() {
  const [active, setActive] = useState<string>("recentDoc");
  const [sortBy, setSortby] = useState<string>("latest")

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

  const navigate = useNavigate();

  const { userData } = useAppSelector((state) => state.auth);

  const [userDocuments, setUserDocument] = useState<DocumentResponse[]>([]);
  const sortedDocuments = [...userDocuments].sort((a,b)=>{
      const dateA = new Date(a.updatedAt).getTime()
      const dateB = new Date(b.updatedAt).getTime()

      if (sortBy === "earliest") {
    return dateA - dateB;
  }

  return dateB - dateA;

  })

  const getAllDocument = async () => {
    try {
      const response = await documentHandler.getAllDocuments();
      if (response.success) {
        setUserDocument(response?.allDocument);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    }
  };

  useEffect(() => {
    getAllDocument();
    console.log(userDocuments);
  }, []);

  const handleCreateDocument = async () => {
    try {
      const response = await documentHandler.createDocument();
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
        getAllDocument();
        toast.success(`Deleted Successfully`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    }
  };
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
              <span className="text-sm">Sort By</span>
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
      </section>

      <section>
        {active === "recentDoc" && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
            {sortedDocuments.map((document) => {
              return (
                <DocumentCard
                  key={document._id}
                  title={document.name}
                  content={document.content}
                  author={document.ownerUser.fullname}
                  date={document.updatedAt}
                  onClick={() => handleDocumentRouting(document._id)}
                  onClickDelete={(e: any) =>
                    handleDocumentDelete(e, document._id)
                  }
                />
              );
            })}
          </div>
        )}
        {active === "sharedWithMe" && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
            Nothing Shared With Right Now
          </div>
        )}
        {active === "myFolder" && (
          <div className="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
            No Folders created !
          </div>
        )}
      </section>
    </main>
  );
}

export default DashboardHome;

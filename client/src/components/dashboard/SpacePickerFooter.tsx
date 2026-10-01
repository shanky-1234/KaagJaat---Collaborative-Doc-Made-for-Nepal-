import { Avatar, AvatarFallback } from "#components/ui/avatar";
import { Button } from "#components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "#components/ui/dialog";
import { Input } from "#components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "#components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select";
import { useAppDispatch, useAppSelector } from "#hooks/reduxHooks";
import { setCurrentSpace } from "@/redux/SpaceSlice";
import { spaceService } from "@/services/spaceHandler";
import type { spaceProps } from "@/types/spaceResponse";
import { ChevronDown, ChevronUp, LockKeyhole, Plus, UserRoundPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const spaceOption = [
  {
    name:'Personal',
    value:'personal'
  },
  {
     name:'Education',
    value:'education'
  },
  {
     name:'Office and Work',
    value:'office'
  },
  {
    name:'Government Works',
    value:'governemtn'
  }
]

const privacyOption = [
   {
    name:'Private',
    value:'private',
    icon:<LockKeyhole/>,
    description:"Only Yours"
  },
  {
     name:'Unlisted',
    value:'restricted',
    icon:<UserRoundPlus/>,
    description:"Only Invitees Allowed"
  },
  {
     name:'Public',
    value:'public',
    icon:<Users/>,
    description:"Anyone with link can open"
  },
]

function SpacePickerFooter() {
  const [open,setOpen] = useState<boolean>(false)
  const [name,setName] = useState<string>("")
  const [purpose, setPurpose] = useState("personal");
const [privacy, setPrivacy] = useState("private");
  const [spaces, setSpaces] = useState<spaceProps[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<spaceProps | null>(null);
  
  const dispatch = useAppDispatch()

  const currentSpace = useAppSelector((state)=>state.space.currentSpace)

      const fetchSpace = async () => {
      try {
        const response = await spaceService.getSpace();
        if (response.success) {
          setSpaces(response?.space);

            const savedSpaceId = localStorage.getItem("currentSpaceId")

            const savedSpace = response.space.find((space)=>space._id === savedSpaceId)

            if (savedSpace){
                dispatch(setCurrentSpace(savedSpace))
            } else{
                 const personalSpace = response.space.find(
            (space) => space.isPersonal,
          );
            if (personalSpace) {
            setSelectedSpace(personalSpace);
            dispatch(setCurrentSpace(personalSpace))
          }
            }
            
        
        }
      } catch (error) {
        console.log("Error", error);
        toast.error("An Error Occured");
      }
    };

  useEffect(() => {

    fetchSpace();
  }, [dispatch]);

  const getInitial = (userName: string | undefined) => {
    if (!userName) return "??";

    const parts = userName.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

    // Takes the first letter of the first name and the first letter of the last name
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const handleCreateSpace = async() =>{
    console.log('create')
    try {
      const data = {
        name,purpose,
        privacy
      }
      const response = await spaceService.createSpace(data)
      if (response.success){
        toast.success("Space Successfully Created")
        fetchSpace()
        setName('')
        setPrivacy("private")
        setPurpose("personal")
        setOpen(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild className="p-2 bg-neutral-100">
        <button
          title={currentSpace?.name}
          className="flex w-full items-center justify-between gap-2 rounded-md p-2 hover:bg-neutral-100 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
        >
          <div className="flex items-center gap-2">
          <Avatar className="shrink-0">
            <AvatarFallback className="bg-primary text-white">
              {getInitial(currentSpace?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden">
          <span>
            {currentSpace?.name}
          </span>
          <span className="text-xs">Current Space</span>
          </div>
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <ChevronUp/>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="outline-none! bg-white  border-neutral-400 ring-neutral-300 ring-1">
        <PopoverHeader className="font-bold">Your Space</PopoverHeader>
        <div className="flex flex-col">
          {spaces.map((space) => {
            return (
              <div
                className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-neutral-100"
                onClick={() => { setSelectedSpace(space) 
                    dispatch(setCurrentSpace(space))
                  localStorage.setItem("currentSpaceId", space._id)}}
              >
                <Avatar className="shrink-0 rounded-2xl!">
                  <AvatarFallback className="bg-neutral-300 outline-none! ring-0! border-0! text-white rounded-2xl!">
                    {getInitial(space?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                <span className="group-data-[collapsible=icon]:hidden">
                  {space?.name}
                </span>
                <div>
                  <span className="text-xs text-neutral-400">  {space?.purpose?.charAt(0).toUpperCase() + space?.purpose?.slice(1)}</span>
                </div>
                </div>
              </div>
            );
          })}
        </div>
        <Dialog defaultOpen={open} onOpenChange={setOpen}>
          <DialogTrigger className="w-full">
            <Button variant='outline' className="w-full p-3 cursor-pointer">
              <div className="flex items-center gap-2">
                <Plus/>
                Create New Space
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border border-neutral-300 outline-0! ring-0! ">
              <div>
              <DialogHeader className="text-xl font-bold">
                Let's Set up Your Space
              </DialogHeader>
              <DialogDescription className="text-neutral-500">
                Organize your workspace more clear
              </DialogDescription>
              </div>
              <div>
                <form className="space-y-4" >
                  <div className="flex flex-col gap-1">
                    <label htmlFor="spaceName">
                      Space Name
                    </label>
                    <Input id="spaceName" value={name} placeholder="Eg. University Works" className="placeholder:text-neutral-400 ring-0! border-neutral-500" onChange={(e)=>setName(e.target.value)}/>
                  </div>
                  <div className="flex gap-2" >
                      <div className="flex flex-col gap-1 w-full">
                        <label>
                          Space Purpose
                        </label>
                     <Select value={purpose} onValueChange={setPurpose}>
                      <SelectTrigger defaultValue={'personal'} className={`
          w-full 
          border
          border-neutral-400
          focus:border-neutral-400!
          focus-visible:border-neutral-400!
          focus-visible:ring-0
          data-[state=open]:border-neutral-400!
        ' }
        `}>
          <SelectValue/>
          </SelectTrigger>
                      <SelectContent defaultValue={'personal'}   position="popper"
        side="bottom"
        align="start"
        className="
          bg-white
          !border-neutral-400
          !ring-0
          !outline-none
        ">
                        {
                          spaceOption.map((space)=>{
                            return( 
                               <SelectItem key={space.value} value={space.value}>
                                <div>
                                  <span>{space.name}</span>
                                </div>
                        </SelectItem>
                            )
                          })
                        }
                       
                      </SelectContent>
                     </Select>
                     </div>

                      <div  className="flex flex-col gap-1 w-full">  
                         <label>
                          Privacy
                        </label>
                      <Select value={privacy} onValueChange={setPrivacy}>
                      <SelectTrigger defaultValue={'private'} className={`
          w-full 
          border
          border-neutral-400
          focus:border-neutral-400!
          focus-visible:border-neutral-400!
          focus-visible:ring-0
          data-[state=open]:border-neutral-400!
        ' }
        `}>
          <SelectValue>
             {privacyOption.find((option) => option.value === privacy)?.name}
          </SelectValue>
          </SelectTrigger>
                      <SelectContent defaultValue={'private'}   position="popper"
        side="bottom"
        align="start"
        className="
          bg-white
          !border-neutral-400
          !ring-0
          !outline-none
        ">
                        {
                          privacyOption.map((option)=>{
                            return( 
                               <SelectItem key={option.value} value={option.value}>
                                <div className="flex gap-2 items-center">
                                  {option.icon}
                                  <div className="flex flex-col">
                                  <span>{option.name}</span>
                                  <span className="text-xs">{option.description}</span>
                                  </div>
                                </div>
                        </SelectItem>
                            )
                          })
                        }
                       
                      </SelectContent>
                     </Select>
                     </div>
                  </div>
                </form>
              </div>
                 <DialogFooter className="border-0 ">
            <DialogClose>
              <Button variant={'ghost'}>
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleCreateSpace} className="bg-primary text-white">Create Space</Button>
          </DialogFooter>
          </DialogContent>
       
        </Dialog>
     
      </PopoverContent>
    </Popover>
  );
}

export default SpacePickerFooter;

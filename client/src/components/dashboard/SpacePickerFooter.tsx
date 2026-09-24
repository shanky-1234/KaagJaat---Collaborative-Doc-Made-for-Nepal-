import { Avatar, AvatarFallback } from "#components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "#components/ui/popover";
import { useAppDispatch, useAppSelector } from "#hooks/reduxHooks";
import { setCurrentSpace } from "@/redux/SpaceSlice";
import { spaceService } from "@/services/spaceHandler";
import type { spaceProps } from "@/types/spaceResponse";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function SpacePickerFooter() {
  const [spaces, setSpaces] = useState<spaceProps[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<spaceProps | null>(null);
  
  const dispatch = useAppDispatch()

  const currentSpace = useAppSelector((state)=>state.space.currentSpace)

  useEffect(() => {
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

  return (
    <Popover>
      <PopoverTrigger asChild className="p-2 bg-neutral-100">
        <button className="flex w-full items-center justify-between gap-2 rounded-md p-2 hover:bg-neutral-100">
          <div className="flex items-center gap-2">
          <Avatar className="shrink-0">
            <AvatarFallback className="bg-primary text-white">
              {getInitial(selectedSpace?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start">
          <span className="group-data-[collapsible=icon]:hidden">
            {currentSpace?.name}
          </span>
          <span className="text-xs">Current Space</span>
          </div>
          </div>
          <div>
            <ChevronUp/>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="outline-none!  border-neutral-400 ring-neutral-300 ring-1">
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
                <span className="group-data-[collapsible=icon]:hidden">
                  {space?.name}
                </span>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SpacePickerFooter;

import {formatDistanceToNow} from 'date-fns'

export const formatDateandTime =  (date:string | Date) =>{
    return formatDistanceToNow(date,{addSuffix:true})
}
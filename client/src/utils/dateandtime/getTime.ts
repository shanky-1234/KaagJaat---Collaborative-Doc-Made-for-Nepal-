export const getTime = () =>{
    const date = new Date()
    const time = date.getHours()
    let periodOfDay = ''

    if (time >=5 && time<12){
        periodOfDay = 'morning'
    }
    else if (time >=12 && time<16){
        periodOfDay = 'afternoon'
    }
    else if (time >=16 && time<19){
        periodOfDay = 'evening'
    }
    else{
        periodOfDay = 'night'
    }
    return periodOfDay
}
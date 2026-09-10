import api from "./api/api"

export async function getNepaliSuggestions (word:string) {
    if(!word.trim()){
        return []
    }

    try {
        const response = await api.get('/transliterate',{
            params:{
                text:word
            }
        })

        return response.data
    } catch (error) {
        console.error("Nepali transliteration error:", error);
    return [];
    }
}
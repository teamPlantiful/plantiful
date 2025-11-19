const cho = [
  'ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ',
  'ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ',
  'ㅋ','ㅌ','ㅍ','ㅎ'
]

export function toChosung(str: string){
    let result = ' '
    for (const char of str){
        const code = char.charCodeAt(0)-44032

        if(code>=0&&code<=11171){
            const chosung = Math.floor(code/588)
            result+=cho[chosung]
        }else{
            result+=char
        }
    }
    return result
}

export function normalizeSearch(value:string){
    if(!value) return {original:'',chosung:''}

    const trimmed = value
    .normalize('NFC')
    .replace(/\s+/g, '')        
    .replace(/[^\w가-힣]/g, '') 
    .trim()

    return{
        original:trimmed,
        chosung:toChosung(trimmed),
    }

}
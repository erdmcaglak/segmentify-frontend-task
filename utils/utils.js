export function stringShorter(str, len = 16) {
    if(str.length > len)
      return str.substring(0, len) + '...'
    else
      return str
}
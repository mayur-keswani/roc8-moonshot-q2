const XLSX = require('xlsx');
import Cookies from 'universal-cookie';

export function setCookie(key:string,value:string){
    const cookies = new Cookies();
    cookies.set(key, value);
    
}
export function getCookie(key: string){
    const cookies = new Cookies();
    return cookies.get(key); 
}
    
export function paredExcelDateCode(excelSerialDate:number){
    let day = XLSX.SSF.parse_date_code(excelSerialDate);
    return `${day.d}/${day.m}/${day.y}`
}
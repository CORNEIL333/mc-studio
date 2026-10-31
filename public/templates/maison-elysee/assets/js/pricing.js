import {validateDates} from './validation.js';
const round=n=>Math.round((n+Number.EPSILON)*100)/100;
export function calculatePrice(room,s,options={}){
 const nights=validateDates(s.arrival,s.departure);let accommodation=0;
 for(let i=0;i<nights;i++){const d=new Date(Date.parse(s.arrival)+i*86400000).getUTCDay();accommodation+=room.rate*s.count*([5,6].includes(d)?1.15:1);}
 accommodation=round(accommodation);const discount=/^ELYSEE10$/i.test(s.promo)?round(accommodation*.1):0;
 const breakfast=options.breakfast?25*(s.adults+s.children)*nights:0;const transfer=options.transfer?120:0;const tax=3*s.adults*nights;
 return {nights,accommodation,discount,breakfast,transfer,tax,total:round(accommodation-discount+breakfast+transfer+tax)};
}
export const euro=n=>new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n);

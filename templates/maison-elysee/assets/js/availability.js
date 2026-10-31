import {rooms} from './rooms.js';
import {validateSearch} from './validation.js';
export const overlaps=(a,b)=>a.arrival<b.departure&&b.arrival<a.departure;
export function occupied(room,s,bookings){
 let maximum=0;
 for(let day=Date.parse(s.arrival);day<Date.parse(s.departure);day+=86400000){const date=new Date(day).toISOString().slice(0,10);maximum=Math.max(maximum,bookings.filter(b=>b.roomId===room.id&&b.arrival<=date&&b.departure>date).reduce((n,b)=>n+b.count,0));}
 return maximum;
}
export function searchRooms(s,bookings=[]){validateSearch(s);return rooms.filter(r=>(!s.category||r.id===s.category)&&s.adults+s.children<=r.capacity*s.count&&occupied(r,s,bookings)+s.count<=r.stock);}

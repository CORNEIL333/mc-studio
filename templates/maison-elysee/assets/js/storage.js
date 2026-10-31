const KEY='maison-elysee-demo-v1';
export function getBookings(){try{const data=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(data))throw Error();return data.filter(b=>b&&typeof b.id==='string'&&typeof b.roomId==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(b.arrival)&&/^\d{4}-\d{2}-\d{2}$/.test(b.departure)&&Number.isInteger(b.count)&&b.count>0&&b.count<=4&&b.price&&Number.isFinite(b.price.total));}catch{return [];}}
export function saveBooking(b){const records=getBookings();records.push(b);localStorage.setItem(KEY,JSON.stringify(records));}
export function removeBooking(id){localStorage.setItem(KEY,JSON.stringify(getBookings().filter(b=>b.id!==id)));}
export function clearBookings(){localStorage.removeItem(KEY);}

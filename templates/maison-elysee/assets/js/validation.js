export const today=()=>new Date().toLocaleDateString('en-CA');
export function validateDates(arrival,departure,now=today()){
 const valid=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&!Number.isNaN(Date.parse(s))&&new Date(s).toISOString().slice(0,10)===s;
 if(!valid(arrival)||!valid(departure))throw Error('Choisissez deux dates valides.');
 const nights=(Date.parse(departure)-Date.parse(arrival))/86400000;
 if(arrival<now)throw Error('L’arrivée ne peut pas être dans le passé.');
 if(nights<=0)throw Error('Le départ doit être après l’arrivée.');
 if(nights>60)throw Error('La simulation est limitée à 60 nuits.');
 return nights;
}
export function validateSearch(s){
 validateDates(s.arrival,s.departure);
 for(const k of ['adults','children','count'])if(!Number.isInteger(s[k]))throw Error('Les nombres de voyageurs et de chambres doivent être entiers.');
 if(s.adults<1||s.adults>20||s.children<0||s.children>20||s.count<1||s.count>4||s.adults<s.count)throw Error('Prévoyez au moins un adulte par chambre, de 1 à 4 chambres, au maximum 20 adultes et 20 enfants.');
 if(s.promo&&!/^ELYSEE10$/i.test(s.promo))throw Error('Code inconnu. Le code de démonstration est ELYSEE10.');
 return true;
}
export function validateGuest(g){if(!g.first?.trim()||!g.last?.trim()||!/^\S+@\S+\.\S+$/.test(g.email)||!g.ack)throw Error('Complétez les champs client et acceptez le caractère fictif du séjour.');return true;}

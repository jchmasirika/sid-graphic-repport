import { format } from "date-fns";
import { Session } from "src/content/recipes/types";

export type AdaptBy = 'parking'|'site'|'day';

export function adaptSessionData(data: Session[], adaptBy: AdaptBy) {
    const map = new Map<string, { total: number, missing: number, invoiceMissing: number, received: number }>([]);
    if(Array.isArray(data)) {
        data.forEach(({ total, missing, invoiceMissing, endAt, parking }) => {
            const date = new Date(endAt);
            // let key = format(date, 'dd-MM-yyyy');
            let key = '';
            const entry = total - missing - invoiceMissing > 0 ? total - missing - invoiceMissing : 0;
            
            switch(adaptBy) {
              case 'parking': 
                key = parking.id;
                break;
              case 'site':
                key = parking.site.id;
                break;
              case 'day': 
                key = date.getDate().toString();
                break;
              default: break;
            }

            if(map.has(key)) {
                const value = map.get(key);
                map.set(key, {
                    total: value.total + total,
                    received: value.received + entry,
                    missing: value.missing + missing,
                    invoiceMissing: value.invoiceMissing + invoiceMissing
                });
            } else {
                map.set(key, { total: entry, missing, invoiceMissing, received: entry });
            }
        
        });
    }

    return Array.from(map.entries());
    
}

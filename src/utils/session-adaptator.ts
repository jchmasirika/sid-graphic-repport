import { format } from "date-fns";
import { Session } from "src/content/recipes/types";

export function convert(data: Session[], type: string) {
    const map = new Map<string, { total: number, missing: number, invoiceMissing: number }>([]);
    if(Array.isArray(data)) {
        data.forEach(({ total, missing, invoiceMissing, endAt, parking }) => {
            const date = new Date(endAt);
            let key = format(date, 'dd-MM-yyyy');
            const entry = total - missing - invoiceMissing;
            
            switch(type) {
              case 'parking': 
                key += '%' + parking?._id + '%' + parking?.name;
                break;
              case 'site':
                key += '%' + parking?.site?._id + '%' + parking?.site?.name;
                break;
              case 'parking-site':
                key += '%' + parking?.site?._id + '%' + parking?.site?.name + '%' + parking?._id + '%' + parking?.name;
                break;
              default: break;
            }

            if(map.has(key)) {
                const value = map.get(key);
                map.set(key, {
                    total: value.total + entry,
                    missing: value.missing + missing,
                    invoiceMissing: value.invoiceMissing + invoiceMissing
                });
            } else {
                map.set(key, { total: entry, missing, invoiceMissing });
            }
        
        });
    }

    return Array.from(map.entries());
    
}

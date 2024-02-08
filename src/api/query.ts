import { DocumentNode, LazyQueryHookOptions, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react"
import { QueryData, Collection } from "./types";

export const useQuery = <Data, QueryType extends QueryData<Data>, OperationVariables = any>(query: DocumentNode, options?: LazyQueryHookOptions<QueryType, OperationVariables>) => {
    const [data, setData] = useState<Data[]|undefined>(undefined);
    const [get, { loading: queryLoading, error }] = useLazyQuery<QueryType, OperationVariables & { endCursor?: string }>(query, options);
    const [loading, setloading] = useState(false);

    const fetch = async (vars? : { 
        lastData?: Data[],
        endCursor?: string,
        total?: number,
        options?: LazyQueryHookOptions<QueryData<Data>, OperationVariables>
    }): Promise<Data[]|undefined> => {
        if(!loading) { // Si c'est le premier lancement
            setloading(true);
            reset();
        }
        const response = await get({
            ...vars?.options, 
            variables: {...vars?.options.variables, endCursor: vars?.endCursor }
        });

        if(response && response.data) {
            const keys = Object.keys(response?.data);
            const collection = keys?.length > 0 ? response.data[keys[0]] : null;

            // Compile data
            const data = vars?.lastData 
                ? [...vars.lastData, ...collection?.edges.map(({ node }) => node )] 
                : collection?.edges.map(({ node }) => node ); 

            // get last session in collection
            const lastSession = collection?.edges[collection.edges.length - 1];
            
            if(lastSession?.cursor && vars?.endCursor != lastSession?.cursor) {
                fetch({ ...vars, endCursor: lastSession?.cursor, lastData: data });
                // console.log(lastSession);
            } 
            // TODO: Analyse profonde du code afin de gerer les erreurs possibles

            setData(data);
        }

        setloading(false);
        return data ? data : undefined;
    };

    const reset = () => {
        setData(undefined);
    };

    useEffect(() => {
        if(error) {
            setloading(false);
            reset();
        }
    }, [error]);

    return { fetch, loading: loading || queryLoading, error, reset, data };
};
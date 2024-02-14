import { gql, useQuery } from "@apollo/client";
import { createContext, useEffect } from "react";
import { Site } from "src/content/recipes/types";

const GET_ACCOUNT = gql `
query getAccount($id: ID!){
    account(id: $id){
      username
      roles
      person {
        name
        site {
          id
          name
          state
          sectionsArray
        }
      }
    }
  }
`;

export type Account = {
    username: string;
    roles: string[];
    person: {
        name: string;
        site: Site
    }
}

export const useGetAccount = (id: string) => {
    const {data, loading, error} = useQuery<{ account: Account}, {id: string }>(GET_ACCOUNT, { variables: { id }});

    return { account: data?.account, loading, error };
};

export const AuthtContext = createContext<Account|undefined>(undefined);


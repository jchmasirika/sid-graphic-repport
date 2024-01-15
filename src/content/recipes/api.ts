import { gql } from "@apollo/client";

export const PARKING_SESSIONS = gql `
    query getParkingSessions($device: String, $parking: String, $before: String!, $after: String!){
        parkingSessions(device_code: $device, parking: $parking, endAt: { before: $before, after: $after }) {
            totalCount
            edges {
                cursor
                node {
                    parking {
                        name
                        site {
                            name
                        }
                    }
                    total
                    missing
                    invoiceMissing
                    device {
                        code
                        site {
                            name
                        }
                    }
                    endAt
                    state
                }
            }
        }
    }
`;
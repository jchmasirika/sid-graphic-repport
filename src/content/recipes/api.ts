import { gql } from "@apollo/client";

export const PARKING_SESSIONS = gql `
    query getParkingSessions($device: String, $parking: String, $sites: [String], $before: String!, $after: String!, $endCursor: String){
        parkingSessions(device_code: $device, parking: $parking, parking_site_list: $sites, after: $endCursor, endAt: { before: $before, after: $after }) {
            totalCount
            edges {
                cursor
                node {
                    parking {
                        id
                        _id
                        name
                        site {
                            id
                            _id
                            name
                        }
                    }
                    total
                    missing
                    invoiceMissing
                    device {
                        code
                        site {
                            id
                            _id
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

export const PARKINGS = gql `
    query getParking($name: String!){
        parkings(name: $name) {
            totalCount
            edges {
                node {
                    id
                    name
                    site {
                        name
                    }
                }
            }
        }
    }
`;

export const DEVICE_BILLERS = gql `
    query getDeviceBiller($code: String, $state: String) {
        deviceBillers(code: $code, state: $state) {
            totalCount
            edges {
                node {
                    code
                    id
                    state
                    site {
                        name
                        _id
                        id
                    }
                }
            }
        }
    }
`;

export const PARKING_SITES = gql `
    query getParkingSites($after: String) {
        taxeParkingSites(after: $after) {
            totalCount
            edges {
                node {
                    id
                    _id
                    name
                    sectionsArray
                    state
                }
            }
        }
    }
`;
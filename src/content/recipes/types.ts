export type Session = {
    device: Device,
    parking: Parking,
    account: Account 
};

export type Device = {
    code: string,
    site?: {
        name?: string
    }
}

export type Parking = {
    name: string,
    site?: {
        name?: string
    }
}

export type Account = {
    id: string,
    username: string,
    person: {
        name: string
    }
}
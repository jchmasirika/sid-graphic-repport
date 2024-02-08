export type Session = {
    device: Device;
    parking: Parking;
    account: Account;
    total: number;
    missing: number;
    invoiceMissing: number;
    endAt: string;
    state?: string;
};

export type Device = {
    id?: string;
    code: string;
    state?: string;
    site?: {
        name?: string;
        id: string;
        _id?: number;
    }
}

export type Parking = {
    id: string;
    _id?: number;
    name: string;
    site?: {
        name?: string;
        id: string;
        _id?: number;
    }
}

export type Account = {
    id: string;
    username: string;
    person: {
        name: string;
    }
}

export type Site = {
    id: string;
    name: string;
    state: string;
    sectionsArray: {
        id: number|string,
        name: string;
    }[];
    sessions?: { total: number; missing: number; invoicesMissing: number}
}

export interface RegisterUserType {
    _id: string | undefined,
    email: string,
    username: string,
    firstName: string,
    middleName?: string,
    lastName: string,
    role: 'ADMIN' | 'CONTRIBUTOR',
    password: string,
}

export type LoginType = {
    email: string
    password: string
}


export interface UserType {
    _id: string | undefined,
    email: string,
    username: string,
    firstName: string,
    middleName?: string,
    lastName: string,
    role: 'ADMIN' | 'CONTRIBUTOR',
    status: 'PENDING' | 'DECLINED' | 'APPROVED'
}
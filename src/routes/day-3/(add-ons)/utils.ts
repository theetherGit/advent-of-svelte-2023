export type DataChild = {
    name: string
    weight: number
}

export type TripData = {
    name: string,
    weight: number,
    children: DataChild[] | []
}

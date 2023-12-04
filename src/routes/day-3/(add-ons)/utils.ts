export type DataChild = {
    name: string
    weight: number
}

export type TripData = {
    name: string,
    weight: number,
    children: DataChild[] | []
}

export const generateRandomString = (
    length: number,
    alphabet: string = 'abcdefghijklmnopqrstuvwxyz1234567890'
) => {
    const randomUint32Values = new Uint32Array(length);
    crypto.getRandomValues(randomUint32Values);
    const u32Max = 0xffffffff;
    let result = "";
    for (let i = 0; i < randomUint32Values.length; i++) {
        const rand = randomUint32Values[i] / (u32Max + 1);
        result += alphabet[Math.floor(alphabet.length * rand)];
    }
    return result;
};

export function groupedKnapsack(childrenList: DataChild[], weightLimit: number) {
    const items = childrenList.sort((a: DataChild, b: DataChild) => b.weight - a.weight);
    const groups = [];

    for (const item of items) {
        let added = false;

        // Try to add the item to the current group
        for (const group of groups) {
            const groupWeight = group.childs.reduce((totalWeight, i) => totalWeight + i.weight, 0);

            // If adding the item doesn't exceed the weight limit, add it to the group
            if (groupWeight + item.weight <= weightLimit) {
                group.childs.push(item);
                group.totalWeight += item.weight;
                added = true;
                break;
            }
        }

        // If adding the item exceeds the weight limit, create a new group
        if (!added) {
            groups.push({
                childs: [item],
                totalWeight: item.weight,
            });
        }
    }

    return groups;
}


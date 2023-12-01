import type {PageLoad} from "./$types";

async function getElvesTallyData(fetch) {
    try {
        const response = await fetch('https://advent.sveltesociety.dev/data/2023/day-one.json')
        if (response.ok) {
            return response.json()
        }
    } catch (e) {
        console.log(e);
        return []
    }
}

export const load: PageLoad = ({fetch}) => {
    return {
        childrens: getElvesTallyData(fetch)
    }
};

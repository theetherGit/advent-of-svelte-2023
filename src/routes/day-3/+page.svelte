<script lang="ts">
    import * as Card from "$lib/components/ui/card"
    import {Button} from "$lib/components/ui/button"
    import * as Table from "$lib/components/ui/table"
    import type {PageData} from "./$types"
    import {Gift, PlaneTakeoff, Weight, Luggage, PlusCircle, Trash2, Pen} from "lucide-svelte";
    import {type Writable, writable} from "svelte/store";
    import type {DataChild, TripData} from "./(add-ons)/utils";
    import {createTable, Render, Subscribe} from "svelte-headless-table";
    import {
        addColumnFilters, addHiddenColumns,
        addPagination,
        addSelectedRows,
        addSortBy,
        addTableFilter
    } from "svelte-headless-table/plugins";
    import DataTablePagination from "./(add-ons)/data-table-pagination.svelte";
    import {Input} from "$lib/components/ui/input";
    import * as Select from '$lib/components/ui/select';
    import * as Accordion from "$lib/components/ui/accordion";
    import {toast} from "sonner-svelte";

    export let data: PageData;

    let tripCount = 1;
    let currentSelectedTrip = 1;
    let selectedCreatingBecauseIDK = { value: currentSelectedTrip, label: `Trip ${currentSelectedTrip}` }

    const children_store = writable(data.childrens);

    $: total_weight = data.childrens.reduce((total, child) => total + child.weight, 0);

    let trips: Record<string, TripData> = {
        1: {
            name: 'Trip 1',
            weight: 0,
            children: []
        }
    };

    function createTrip() {
        tripCount += 1;
        const oldTrips = {...trips};

        oldTrips[tripCount] = {
            name: `Trip ${tripCount}`,
            weight: 0,
            children: []
        };
        trips = {...oldTrips};
        currentSelectedTrip = tripCount;
        selectedCreatingBecauseIDK = { value: currentSelectedTrip, label: `Trip ${currentSelectedTrip}` }
    }

    function deleteTrip(tripId: number) {
        tripCount -= 1;

        const oldTrips = {...trips};
        $children_store = [...$children_store, ...oldTrips[tripId].children]

        delete oldTrips[tripId];

        trips = {...oldTrips}
    }

    function deleteWeightFromTrip(tripId: number, child: DataChild) {
        const currentTrip = trips[tripId];
        const newChildrenDataTrip = currentTrip.children.filter((c: DataChild) => c.name != child.name);
        $children_store = [...$children_store, child];
        currentTrip["children"] = newChildrenDataTrip;
        trips[tripId] = currentTrip;
    }

    function addToTrip(rowData: DataChild) {
        const checkWeight = trips[currentSelectedTrip]["weight"] + rowData.weight;
        if (checkWeight > 100) {
            return toast.error('Trip max weight can not be greater than 100.')
        }
        trips[currentSelectedTrip]["weight"] = checkWeight;
        $children_store = $children_store.filter((child: DataChild) => child.name != rowData.name);
        trips[currentSelectedTrip]["children"] = [...trips[currentSelectedTrip]["children"], rowData];
    }

    const table = createTable(children_store, {
        select: addSelectedRows(),
        sort: addSortBy({
            toggleOrder: ["asc", "desc"]
        }),
        page: addPagination(),
        filter: addTableFilter({
            fn: ({ filterValue, value }) => {
                return value.toLowerCase().includes(filterValue.toLowerCase());
            }
        }),
        colFilter: addColumnFilters(),
        hide: addHiddenColumns()
    });

    const columns = table.createColumns([
        table.column({
            accessor: "name",
            header: "Name",
            id: "name",
            plugins: {
                sort: {
                    disable: true
                }
            }
        }),
        table.column({
            accessor: "weight",
            header: "Weight",
            id: "weight",
            plugins: {
                sort: {
                    disable: false
                }
            }
        }),
    ]);

    const tableModel = table.createViewModel(columns);

    const { headerRows, pageRows, tableAttrs, tableBodyAttrs } = tableModel;

    const { pluginStates } = tableModel;
    const {
        filterValue
    }: {
        filterValue: Writable<string>;
    } = pluginStates.filter;

    const {
        filterValues
    }: {
        filterValues: Writable<{
            tag: string[];
        }>;
    } = pluginStates.colFilter;
</script>

<div class="grid gap-y-4 px-5">
    <div class="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-sm font-medium">Total Children</Card.Title>
                <Gift class="h-4 w-4 text-amber-600" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{$children_store.length}</div>
                <p class="text-xs text-muted-foreground">
                    Children waiting for gifts.
                </p>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-sm font-medium">Total Weight</Card.Title>
                <Weight class="h-4 w-4 text-green-500" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{new Intl.NumberFormat('en-In', {maximumFractionDigits: 2}).format(total_weight)}</div>
                <p class="text-xs text-muted-foreground">
                    Total Weight of gifts for the children.
                </p>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-sm font-medium">Average Trips</Card.Title>
                <PlaneTakeoff class="h-4 w-4 text-indigo-500" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{Math.round(total_weight/100)}</div>
                <p class="text-xs text-muted-foreground">
                    System calculated
                </p>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-sm font-medium">Trips Created</Card.Title>
                <Luggage class="h-4 w-4 text-primary" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{Object.entries(trips).length}</div>
                <p class="text-xs text-muted-foreground">
                    Trips created by you
                </p>
            </Card.Content>
        </Card.Root>
    </div>

    <div class="flex items-center overflow-y-auto no-scrollbar gap-x-5">
            <Card.Root class="min-w-[200px] md:min-w-[300px] h-full p-4">
                    <Card.Content class="grid gap-y-2.5">
                        <Button on:click={createTrip} class="w-full">Create Trip</Button>
                        <Select.Root
                                onSelectedChange={(selected) => currentSelectedTrip = Number(selected?.value)}
                                selected={selectedCreatingBecauseIDK}
                        >
                            <Select.Trigger class="w-full">
                                <Select.Value placeholder="Select Trip to Update" />
                            </Select.Trigger>
                            <Select.Content class="mt-1 w-full">
                                {#each Object.entries(trips) as [id, {name}]}
                                    <Select.Item value={id}>{name}</Select.Item>
                                {/each}
                            </Select.Content>
                        </Select.Root>
                        <Button disabled on:click={createTrip} variant="secondary" class="w-full">Solve it System!!</Button>
                    </Card.Content>
            </Card.Root>
        {#each Object.entries(trips) as [id, {name, weight, children}]}
            <Card.Root class="min-w-[250px] md:min-w-[300px] {currentSelectedTrip === Number(id) ? 'border-primary': weight > 90 ? 'border-destructive' : ''}">
                <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Card.Title class="text-sm font-medium">{name}</Card.Title>
                    <Luggage class="h-4 w-4 text-primary" />
                </Card.Header>
                <Card.Content>
                    <div><span class="text-2xl font-bold">{children?.length ?? 0}</span> <span class="text-sm">Child(s)</span></div>
                    <p class="text-xs {weight > 90 ? 'text-destructive' : weight > 75 ? 'text-amber-600' : 'text-muted-foreground'}">
                        Weight: {new Intl.NumberFormat('en-In', {maximumFractionDigits: 1}).format(weight)} Kg
                    </p>
                </Card.Content>
                <Card.Footer class="grid grid-cols-2 gap-x-2">
                    <Button on:click={() => (currentSelectedTrip = Number(id))} class="w-full flex items-center gap-x-2" variant="warning"><Pen class="w-4 h-4"/> Update</Button>
                    <Button on:click={() => deleteTrip(Number(id))} class="w-full flex items-center gap-x-2" variant="destructive"><Trash2 class="w-4 h-4"/> Delete</Button>
                </Card.Footer>
            </Card.Root>
        {/each}
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="w-full">
            <div class="rounded-lg border">
                <div class="border-b p-2">
                    <div class="grid gap-y-2 md:flex md:items-center md:justify-between">
                        <Input
                                placeholder="Filter name..."
                                class="h-12 w-full"
                                type="text"
                                bind:value={$filterValue}
                        />
                    </div>
                </div>
                <div class="border-b">
                    <Table.Root {...$tableAttrs}>
                        <Table.Header>
                            {#each $headerRows as headerRow}
                                <Subscribe rowAttrs={headerRow.attrs()}>
                                    <Table.Row>
                                        {#each headerRow.cells as cell (cell.id)}
                                            <Subscribe
                                                    attrs={cell.attrs()}
                                                    let:attrs
                                                    props={cell.props()}
                                            >
                                                <Table.Head {...attrs}>
                                                    <Render of={cell.render()} />
                                                </Table.Head>
                                            </Subscribe>
                                        {/each}
                                    </Table.Row>
                                </Subscribe>
                            {/each}
                        </Table.Header>
                        <Table.Body {...$tableBodyAttrs}>
                            {#each $pageRows as row (row.id)}
                                <!--{console.log(row)}-->
                                <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                                    <Table.Row {...rowAttrs} class="">
                                        {#each row.cells as cell (cell.id)}
                                            <Subscribe attrs={cell.attrs()} let:attrs>
                                                <Table.Cell {...attrs}>
                                                    <Render of={cell.render()} />
                                                </Table.Cell>
                                            </Subscribe>
                                        {/each}
                                        <Table.Cell class="flex items-center justify-end">
                                            <Button on:click={() => addToTrip(row.original)} class="flex items-center space-x-4" variant="default">
                                                <PlusCircle />
                                                <span> Add to Trip {currentSelectedTrip}</span>
                                            </Button>
                                        </Table.Cell>
                                    </Table.Row>
                                </Subscribe>
                            {/each}
                        </Table.Body>
                    </Table.Root>
                </div>
                <DataTablePagination {tableModel} />
            </div>
        </div>

        <div class="border rounded-lg">
            <Accordion.Root value={currentSelectedTrip.toString()}>
                {#each Object.entries(trips) as [id, {name, weight, children}]}
                    <Accordion.Item value={id}>
                        <Accordion.Trigger class="px-5">{name} </Accordion.Trigger>
                        <Accordion.Content>
                            <div class="flex items-center justify-between">
                                {#if children.length}
                                    <Table.Root>
                                        <Table.Caption>Total Weight in {name}: {new Intl.NumberFormat('en-In', {maximumFractionDigits: 2}).format(weight)} Kg</Table.Caption>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.Head>Name</Table.Head>
                                                <Table.Head>Weight</Table.Head>
                                                <Table.Head class="text-right">Actions</Table.Head>
                                            </Table.Row>
                                        </Table.Header>
                                        {#each children as child}
                                            <Table.Row class="gap-y-2.5">
                                                <Table.Cell>{child.name}</Table.Cell>
                                                <Table.Cell>{child.weight}</Table.Cell>
                                                <Table.Cell class="flex items-center justify-end">
                                                    <Button on:click={() => deleteWeightFromTrip(Number(id), child)} class="flex items-center space-x-4" variant="ghost" size="icon">
                                                        <Trash2 class="text-destructive"/>
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        {/each}
                                    </Table.Root>
                                {:else}
                                    <p class="px-5">No Children found</p>
                                {/if}
                            </div>
                        </Accordion.Content>
                    </Accordion.Item>
                {/each}
            </Accordion.Root>
        </div>
    </div>
</div>

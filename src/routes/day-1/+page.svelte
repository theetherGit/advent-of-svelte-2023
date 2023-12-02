<script lang="ts">
    import type {PageData} from "./$types";
    import {get, type Writable, writable} from "svelte/store";
    import * as  Card from "$lib/components/ui/card";
    import * as Table from "$lib/components/ui/table"
    import {Cat, Sparkle, Book, FilePlus, ListRestart, Plus} from "lucide-svelte";
    import type {Child} from "./(add-ons)/utils";
    import DataTablePagination from "./(add-ons)/data-table-pagination.svelte"
    import { Render, Subscribe, createTable} from "svelte-headless-table";
    import {
        addColumnFilters,
        addHiddenColumns,
        addPagination,
        addSelectedRows,
        addSortBy,
        addTableFilter
    } from "svelte-headless-table/plugins";
    import {tags} from "./(add-ons)/utils";
    import {Input} from "$lib/components/ui/input";
    import DataTableFacetedFilter from "./(add-ons)/data-table-faceted-filter.svelte";
    import {slide} from "svelte/transition";
    import * as Sheet from "$lib/components/ui/sheet";
    import { Button } from "$lib/components/ui/button";
    import { Label } from "$lib/components/ui/label";
    import {toast} from "sonner-svelte";

    export let data: PageData;

    let added_by_you: number = 0;

    const children_store = writable(data.childrens);

    let new_child: Child = {
        name: 'Shivam',
        tally: 68 + 1
    };

    function saveData() {
        added_by_you += 1;
        $children_store = [...$children_store, new_child];
        toast.success(`Successfully added ${new_child.name}`)
        new_child = {
            name: 'Shivam',
            tally: 68 + 1
        }
    }

    // Planned something else but not being used like that
    $: ache_bacche = $children_store.filter((c: Child) => c.tally >= 0).sort((a: Child, b: Child) => b.tally - a.tally);
    $: harami_balak = $children_store.filter((c: Child) => c.tally < 0).sort((a: Child, b: Child) => a.tally - b.tally);
    // Till here

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
            accessor: "tally",
            header: "Tally",
            id: "tally",
        }),
        table.column({
            accessor: "tally",
            header: "Tag",
            id: "tag",
            cell: ({ value }) => {
                if (value < 0) return `Naughty`;
                return  'Nice'
            },
            plugins: {
                colFilter: {
                    fn: ({ filterValue, value }) => {
                        if (filterValue.length === 0) return true;
                        return filterValue.some((filter) => {
                            if (filter === 'Naughty') return value < 0
                            if (filter === 'Nice') return value > 0
                        });
                    },
                    initialFilterValue: [],
                    render: ({ filterValue }) => {
                        return get(filterValue);
                    }
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

    $: showReset = Object.values($filterValues).some((v) => v.length > 0);

</script>

<div class="flex flex-col items-center my-5 space-y-4">
    <div class="w-full grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-5 px-5">
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-sm font-medium">Total Childs</Card.Title>
                <Book class="h-4 w-4 text-indigo-500" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{$children_store.length}</div>
                <p class="text-xs text-muted-foreground">
                    Ready for gifts.
                </p>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-sm font-medium">Nicest Child</Card.Title>
                <Sparkle class="h-4 w-4 text-amber-500" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{ache_bacche[0].name.split(' ')[0]}</div>
                <p class="text-xs text-muted-foreground">
                    {ache_bacche.length} are nice childs.
                </p>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-sm font-medium">Naughtiest Child</Card.Title>
                <Cat class="h-4 w-4 text-red-500" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{harami_balak[0].name.split(' ')[0]}</div>
                <p class="text-xs text-muted-foreground">
                    {harami_balak.length} are naughty childs.
                </p>
            </Card.Content>
        </Card.Root>
        <Card.Root>
            <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
                <Card.Title class="text-sm font-medium">Added by You</Card.Title>
                <FilePlus class="h-4 w-4 text-green-500" />
            </Card.Header>
            <Card.Content>
                <div class="text-2xl font-bold">{added_by_you}</div>
                <p class="text-xs text-muted-foreground">
                    Reset on Reload
                </p>
            </Card.Content>
        </Card.Root>
    </div>
    <div class="px-5 w-full">
        <div class="rounded-lg border">
            <div class="border-b p-2">
                <div class="grid gap-y-2 md:flex md:items-center md:justify-between">
                    <div class="grid grid-cols-2 gap-y-2 md:flex md:flex-1 md:items-center md:space-x-2">
                        <Input
                                placeholder="Filter name..."
                                class="h-8 w-[150px] lg:w-[250px]"
                                type="text"
                                bind:value={$filterValue}
                        />

                        <DataTableFacetedFilter
                                bind:filterValues={$filterValues.tag}
                                title="Tag"
                                options={tags}
                        />

                        {#if showReset}
                            <div transition:slide class="col-span-2 flex items-center justify-center">
                                <Button
                                        on:click={() => {
						$filterValues.tag = [];
					}}
                                        variant="ghost"
                                        class="h-8 px-2 lg:px-3"
                                >
                                    Reset
                                    <ListRestart class="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        {/if}
                    </div>
                    <div class="flex">
                        <Sheet.Root>
                            <Sheet.Trigger asChild let:builder>
                                <Button class="w-full md:w-fit flex items-center justify-center gap-x-2" builders={[builder]}>
                                    <Plus class="h-4 w-4" />
                                    Add Child
                                </Button>
                            </Sheet.Trigger>
                            <Sheet.Content side="right">
                                <Sheet.Header>
                                    <Sheet.Title>Add Child</Sheet.Title>
                                    <Sheet.Description>
                                        As this system is new to you, we are going explain to you, how to use it.
                                        This is a simple form you add name and tally of child, and it will save it on
                                        system.
                                    </Sheet.Description>
                                </Sheet.Header>
                                <div class="grid gap-4 py-4">
                                    <div class="grid grid-cols-4 items-center gap-4">
                                        <Label for="name" class="text-right">Name</Label>
                                        <Input id="name" bind:value={new_child.name} class="col-span-3" />
                                    </div>
                                    <div class="grid grid-cols-4 items-center gap-4">
                                        <Label for="tally" class="text-right">Tally</Label>
                                        <Input id="tally" on:input={() => {new_child['tally'] = Number(new_child.tally)}} bind:value={new_child.tally} class="col-span-3" />
                                    </div>
                                </div>
                                <Sheet.Footer>
                                    <Sheet.Close asChild let:builder>
                                        <Button on:click={saveData} builders={[builder]} type="submit">Save changes</Button>
                                    </Sheet.Close>
                                </Sheet.Footer>
                            </Sheet.Content>
                        </Sheet.Root>
                    </div>
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
                            <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
                                <Table.Row {...rowAttrs}>
                                    {#each row.cells as cell (cell.id)}
                                        <Subscribe attrs={cell.attrs()} let:attrs>
                                            <Table.Cell {...attrs}>
                                                <Render of={cell.render()} />
                                            </Table.Cell>
                                        </Subscribe>
                                    {/each}
                                </Table.Row>
                            </Subscribe>
                        {/each}
                    </Table.Body>
                </Table.Root>
            </div>
            <DataTablePagination {tableModel} />
        </div>
    </div>
</div>

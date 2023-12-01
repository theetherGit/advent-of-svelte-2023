<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-svelte';
    import * as Select from '$lib/components/ui/select';
    import type { AnyPlugins } from 'svelte-headless-table/lib/types/TablePlugin';
    import type { TableViewModel } from 'svelte-headless-table';
    import type {Child} from "./utils";

    export let tableModel: TableViewModel<Child, AnyPlugins>;

    const { pageRows, pluginStates, rows } = tableModel;

    const { hasNextPage, hasPreviousPage, pageIndex, pageCount, pageSize } = pluginStates.page;

    const { selectedDataIds } = pluginStates.select;
</script>

<div class="grid gap-y-2 md:flex md:items-center md:justify-between p-2">
    <div class="hidden md:block flex-1 text-sm text-muted-foreground">
        {Object.keys($selectedDataIds).length} of{' '}
        {$rows.length} row(s) selected.
    </div>
    <div class="grid gap-y-2 md:flex md:items-center md:space-x-6 lg:space-x-8">
        <div class="grid gap-y-2 md:flex items-center justify-center space-x-2">
            <p class="text-sm font-medium text-center md:text-center">Rows per page</p>
            <Select.Root
                    onSelectedChange={(selected) => pageSize.set(Number(selected?.value))}
                    selected={{ value: 10, label: '10' }}
            >
                <Select.Trigger class="w-[180px]">
                    <Select.Value placeholder="Select page size" />
                </Select.Trigger>
                <Select.Content>
                    <Select.Item value="10">10</Select.Item>
                    <Select.Item value="20">20</Select.Item>
                    <Select.Item value="30">30</Select.Item>
                    <Select.Item value="40">40</Select.Item>
                    <Select.Item value="50">50</Select.Item>
                </Select.Content>
            </Select.Root>
        </div>
        <div class="hidden md:flex w-[100px] items-center justify-center text-sm font-medium">
            Page {$pageIndex + 1} of {$pageCount}
        </div>
        <div class="flex items-center justify-center space-x-2 md:space-x-1">
            <Button
                    variant="outline"
                    class="h-8 w-8 p-0 lg:flex"
                    on:click={() => ($pageIndex = 0)}
                    disabled={!$hasPreviousPage}
            >
                <span class="sr-only">Go to first page</span>
                <ChevronsLeft size={15} />
            </Button>
            <Button
                    variant="outline"
                    class="p-0 w-8 h-8"
                    on:click={() => ($pageIndex = $pageIndex - 1)}
                    disabled={!$hasPreviousPage}
            >
                <span class="sr-only">Go to previous page</span>
                <ChevronLeft size={15} />
            </Button>
            <div class="md:hidden flex w-[100px] items-center justify-center text-sm font-medium">
                Page {$pageIndex + 1} of {$pageCount}
            </div>
            <Button
                    variant="outline"
                    class="p-0 w-8 h-8"
                    disabled={!$hasNextPage}
                    on:click={() => ($pageIndex = $pageIndex + 1)}
            >
                <span class="sr-only">Go to next page</span>
                <ChevronRight size={15} />
            </Button>
            <Button
                    variant="outline"
                    class="h-8 w-8 p-0 lg:flex"
                    disabled={!$hasNextPage}
                    on:click={() => ($pageIndex = Math.ceil($rows.length / $pageRows.length) - 1)}
            >
                <span class="sr-only">Go to last page</span>
                <ChevronsRight size={15} />
            </Button>
        </div>
    </div>
</div>

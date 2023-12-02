<script lang="ts">
    import {aosDetails} from "$lib/utils";
    import * as Card from "$lib/components/ui/card"
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
    {#each aosDetails as data}
        <Card.Root>
            <Card.Header>

            </Card.Header>
            <Card.Content>

            </Card.Content>
            <Card.Footer>

            </Card.Footer>
        </Card.Root>
    {/each}
</div>

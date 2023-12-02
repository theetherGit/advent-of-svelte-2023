<script lang="ts">
    import ThemeSwitcher from './ThemeSwitcher.svelte';
    import { Button } from '$lib/components/ui/button';
    import { Github } from 'lucide-svelte';
    import SvelteSanta from '$lib/assets/santa-svelte.png';
</script>

<div class="fixed w-full">
    <div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6 mt-2">
        <nav class="px-4 py-2 supports-[backdrop-filter]:bg-background/60 dark:supports-[backdrop-filter]:bg-background/30 sticky top-0 z-30 border rounded-lg border-border/50 bg-background/95 shadow-sm backdrop-blur transition duration-500 ease-in-out">
            <div class="flex items-center justify-between gap-x-4">
                <a href="/" class="flex items-center gap-x-2 p-1 group w-full font-bold">
                    <img src={SvelteSanta} alt="Svelte Santa logo" class="w-10 h-10 object-contain" />
                    <h3 class="relative">
                        AoS 2023
                    </h3>
                </a>
                <div class="flex items-center justify-evenly gap-x-4">
                    <Button href="https://github.com/theetherGit/advent-of-svelte-2023" variant="ghost" size="icon" target="_blank">
                        <Github class="h-[1.2rem] w-[1.2rem]" />
                    </Button>
                    <ThemeSwitcher />
                </div>
            </div>
    </nav>
    </div>
</div>

<script>
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'sonner-svelte';
	import Navbar from "$lib/components/extended-ui/Navbar.svelte";
</script>

<ModeWatcher />
<div class="bg-background h-full">
    <Toaster position="top-center" closeButton richColors/>
    <Navbar />
    <div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6 pt-24">
        <slot />
    </div>
</div>

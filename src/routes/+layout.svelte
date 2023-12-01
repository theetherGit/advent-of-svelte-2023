<script>
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'sonner-svelte';
</script>

<ModeWatcher />
<div class="bg-background h-full">
    <Toaster position="top-center" closeButton richColors/>
    <slot />
</div>

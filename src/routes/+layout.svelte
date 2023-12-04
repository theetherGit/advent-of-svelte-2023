<script>
	import '../app.pcss';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from 'sonner-svelte';
	import Navbar from "$lib/components/extended-ui/Navbar.svelte";
	import { partytownSnippet } from '@builder.io/partytown/integration';
</script>

<svelte:head>
    <script>
		partytown = {
			forward: ['dataLayer.push']
		};
    </script>

    {@html '<script>' + partytownSnippet() + '</script>'}

    <script
            type="text/partytown"
            src="https://www.googletagmanager.com/gtag/js?id=G-PGXN0M6LF0"
    ></script>
    <script type="text/partytown">
		window.dataLayer = window.dataLayer || [];
		function gtag() {
			dataLayer.push(arguments);
		}
		gtag('js', new Date());
		gtag('config', 'G-PGXN0M6LF0');
    </script>
</svelte:head>

<ModeWatcher />
<div class="bg-background h-full">
    <Toaster position="top-center" closeButton richColors/>
    <Navbar />
    <div class="max-w-7xl mx-auto px-6 md:px-12 xl:px-6 pt-24">
        <slot />
    </div>
</div>

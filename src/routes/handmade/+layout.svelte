<script lang="ts">
	import './handmade-rebel-frames.css';

	let { children } = $props();
</script>

<div
	class="min-h-[100dvh] min-h-screen overflow-x-clip bg-[#fafafa] pt-[calc(4.25rem+env(safe-area-inset-top,0px))] text-black md:pt-[calc(4.5rem+env(safe-area-inset-top,0px))]"
	data-nav-bg="light"
>
	{@render children()}
</div>

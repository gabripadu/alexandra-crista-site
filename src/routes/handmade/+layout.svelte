<script lang="ts">
	import './handmade-rebel-frames.css';

	let { children } = $props();
</script>

<div
	class="min-h-screen bg-[#fafafa] pt-[4.25rem] text-black md:pt-[4.5rem]"
	data-nav-bg="light"
>
	{@render children()}
</div>

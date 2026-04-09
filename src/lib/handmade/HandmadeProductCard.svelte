<script lang="ts">
	import type { HandmadeSlide } from './gallery';

	let { serial, title, priceLabel, slides }: {
		serial: string;
		title: string;
		priceLabel: string;
		slides: HandmadeSlide[];
	} = $props();

	let index = $state(0);

	const current = $derived(slides[index] ?? slides[0]);

	function inCenterHotspot(e: MouseEvent, el: HTMLElement) {
		const r = el.getBoundingClientRect();
		const nx = (e.clientX - r.left) / r.width - 0.5;
		const ny = (e.clientY - r.top) / r.height - 0.5;
		return Math.abs(nx) <= 0.22 && Math.abs(ny) <= 0.24;
	}

	function onFrameClick(e: MouseEvent) {
		const el = e.currentTarget as HTMLElement;
		if (!inCenterHotspot(e, el)) return;
		if (slides.length <= 1) return;
		e.preventDefault();
		index = (index + 1) % slides.length;
	}

	function onFrameKeydown(e: KeyboardEvent) {
		if (e.key !== 'Enter' && e.key !== ' ') return;
		e.preventDefault();
		if (slides.length <= 1) return;
		index = (index + 1) % slides.length;
	}
</script>

<div class="product-card group w-full min-w-0" data-tilt>
	<div
		class="relative aspect-[4/5] overflow-hidden bg-neutral-200 shadow-2xl select-none outline-none focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fafafa] {slides.length > 1
			? 'cursor-pointer'
			: 'cursor-default'}"
		role="button"
		tabindex="0"
		aria-label="Galerie {title}: apasă în centrul imaginii pentru fotografia următoare ({slides.length} imagini)"
		onclick={onFrameClick}
		onkeydown={onFrameKeydown}
	>
		<img
			src={current.src}
			alt={current.alt}
			class="pointer-events-none h-full w-full object-cover transition-transform duration-[2s] grayscale group-hover:scale-110 group-hover:grayscale-0"
			draggable="false"
		/>
		<div
			class="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/20"
		>
			<div
				class="flex h-24 w-24 scale-50 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
			>
				<span class="text-center text-[10px] font-bold tracking-widest uppercase">Detalii</span>
			</div>
		</div>
	</div>
	<div class="mt-6 flex items-start justify-between gap-4 md:mt-8 md:gap-5">
		<div class="min-w-0">
			<span class="font-mono text-[10px] tracking-widest text-neutral-400 uppercase">{serial}</span>
			<h3 class="text-3xl font-bold tracking-tighter uppercase md:text-4xl">{title}</h3>
			{#if slides.length > 1}
				<p class="mt-2 font-mono text-[9px] tracking-wider text-neutral-400 uppercase">
					Centru imagine · {index + 1}/{slides.length}
				</p>
			{/if}
		</div>
		<p class="shrink-0 text-3xl font-black italic">{priceLabel}</p>
	</div>
</div>

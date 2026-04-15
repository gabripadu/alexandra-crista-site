<script lang="ts">
	type Frame = { src: string; alt: string };

	let {
		frames,
		frameVariant,
		stagger,
		pieceTitle,
		pieceIndex,
		eager,
		paused,
		onOpenLightbox
	}: {
		frames: Frame[];
		frameVariant: number;
		stagger: string;
		pieceTitle: string;
		pieceIndex: number;
		eager: boolean;
		paused: boolean;
		onOpenLightbox: (detail: { frames: Frame[]; index: number; pieceIndex: number }) => void;
	} = $props();

	let idx = $state(0);
	const multi = $derived(frames.length > 1);

	$effect(() => {
		if (typeof window === 'undefined' || !multi) return;
		if (paused) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const n = frames.length;
		const id = window.setInterval(() => {
			idx = (idx + 1) % n;
		}, 3000);
		return () => window.clearInterval(id);
	});

	const current = $derived(frames[idx] ?? frames[0]);
</script>

<figure
	style="--frame-stagger: {stagger}"
	class="handmade-rebel-frame handmade-rebel-frame--compact group relative w-full max-w-[11.5rem] shrink-0 sm:max-w-[12.5rem] md:max-w-[13rem] {`handmade-rebel-frame--v${frameVariant}`}"
>
	<div class="handmade-rebel-frame__shell" aria-hidden="true"></div>
	<div class="handmade-rebel-frame__inner">
		<button
			type="button"
			class="handmade-lightbox-trigger relative block h-full w-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
			onclick={() => onOpenLightbox({ frames, index: idx, pieceIndex })}
			aria-label={`Mărește imaginea: ${pieceTitle}`}
		>
			<img
				src={current.src}
				alt={current.alt}
				class="handmade-rebel-frame__img pointer-events-none h-full w-full object-cover grayscale transition-[filter,transform,opacity] duration-500 ease-out group-hover:scale-[1.04] group-hover:grayscale-0"
				loading={eager ? 'eager' : 'lazy'}
				draggable="false"
			/>
			{#if multi}
				<span
					class="pointer-events-none absolute bottom-1.5 left-1/2 flex -translate-x-1/2 gap-1"
					aria-hidden="true"
				>
					{#each frames as _, di (di)}
						<span
							class="h-1 w-1 rounded-full transition-colors {di === idx
								? 'bg-white shadow-sm ring-1 ring-black/20'
								: 'bg-black/25'}"
						></span>
					{/each}
				</span>
			{/if}
		</button>
	</div>
</figure>

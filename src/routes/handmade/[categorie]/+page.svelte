<script lang="ts">
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import X from 'lucide-svelte/icons/x';
	import HandmadeCategoryPieceFrame from '$lib/handmade/HandmadeCategoryPieceFrame.svelte';
	import type { HandmadeSlide } from '$lib/handmade/gallery';

	let { data } = $props();
	const category = $derived(data.category);
	const intro = $derived(data.intro);
const instagramOrderUrl = 'https://www.instagram.com/direct/t/17845325352021081/';

	function slideFrames(slide: HandmadeSlide): { src: string; alt: string }[] {
		if (slide.carousel && slide.carousel.length > 0) return slide.carousel;
		return [{ src: slide.src, alt: slide.alt }];
	}

	type LightboxState = {
		frames: { src: string; alt: string }[];
		index: number;
		pieceIndex: number;
		pieceTitle: string;
		pieceDescription?: string;
	};

	let lightbox = $state<LightboxState | null>(null);

	function openLightbox(detail: {
		frames: { src: string; alt: string }[];
		index: number;
		pieceIndex: number;
	}) {
		const slide = category.slides[detail.pieceIndex];
		const pieceTitle = slide?.title ?? `Piesă ${detail.pieceIndex + 1}`;
		lightbox = {
			...detail,
			pieceTitle,
			pieceDescription: slide?.description
		};
	}

	function closeLightbox() {
		lightbox = null;
	}

	function lightboxStep(delta: number) {
		const lb = lightbox;
		if (!lb || lb.frames.length < 2) return;
		const n = lb.frames.length;
		lightbox = { ...lb, index: (lb.index + delta + n) % n };
	}

	function onLightboxKeydown(e: KeyboardEvent) {
		if (!lightbox) return;
		if (e.key === 'Escape') {
			e.preventDefault();
			closeLightbox();
			return;
		}
		if (lightbox.frames.length < 2) return;
		if (e.key === 'ArrowLeft') {
			e.preventDefault();
			lightboxStep(-1);
		} else if (e.key === 'ArrowRight') {
			e.preventDefault();
			lightboxStep(1);
		}
	}

	$effect(() => {
		if (typeof document === 'undefined') return;
		if (!lightbox) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = prev;
		};
	});
</script>

<svelte:window onkeydown={onLightboxKeydown} />

<svelte:head>
	<title>{category.title} — Atelier handmade | Alexandra Crîsta</title>
	<meta
		name="description"
		content="Colecție {category.title.toLowerCase()} — Alexandra Crîsta, lucrat manual la comandă."
	/>
</svelte:head>

<section
	class="relative overflow-x-hidden px-4 pb-16 sm:px-6 sm:pb-24 md:px-12 md:pb-32 lg:px-24"
>
	<div
		class="pointer-events-none absolute top-8 right-0 text-[12vw] font-black uppercase leading-none text-black/[0.04]"
	>
		{category.title}
	</div>

	<div class="relative mx-auto max-w-7xl">
		<p class="font-mono text-[10px] tracking-[0.45em] text-neutral-400 uppercase md:text-xs">
			Atelier · {category.serial.replace('S/N: ', '')}
		</p>
		<h1
			class="font-syne mt-4 max-w-full text-balance break-words text-4xl font-black tracking-tighter uppercase sm:text-5xl md:mt-6 md:max-w-4xl md:text-7xl lg:text-8xl"
		>
			{category.title}
		</h1>
		<p
			class="reveal-text mt-8 max-w-2xl text-lg leading-relaxed font-light text-neutral-600 md:mt-10 md:text-xl"
		>
			{intro}
		</p>
		<a
			href={instagramOrderUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="font-syne group mt-6 inline-flex w-full max-w-xl items-center justify-center gap-3 border-2 border-black bg-black px-6 py-4 text-center text-xs font-bold tracking-[0.22em] text-white uppercase shadow-[0_8px_28px_rgba(0,0,0,0.18)] transition-colors duration-300 hover:bg-white hover:text-black hover:shadow-[0_12px_36px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:w-auto sm:justify-start md:mt-8 md:px-8 md:py-4 md:text-sm md:tracking-[0.28em]"
			aria-label="Comandă pe Instagram: {category.priceLabel}"
		>
			<span class="text-[11px] md:text-sm">{category.priceLabel}</span>
			<ArrowUpRight
				class="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-45"
				aria-hidden="true"
			/>
		</a>

		<div class="handmade-piece-list mt-14 flex flex-col gap-8 md:mt-20 md:gap-10 lg:gap-12">
			{#each category.slides as slide, i (slide.src + String(i))}
				{@const frameVariant = (i % 9) + 1}
				{@const pieceLabel = `${category.serial.replace('S/N: ', '')} · ${String(i + 1).padStart(2, '0')}`}
				{@const pieceTitle = slide.title ?? `Piesă ${i + 1}`}
				{@const pieceTitleLines = pieceTitle.includes(':') ? pieceTitle.split(/:\s*/, 2) : null}
				<article
					class="handmade-piece-card group flex flex-col items-start gap-7 rounded-2xl border border-black/[0.08] bg-white/75 p-4 shadow-[0_8px_26px_rgba(0,0,0,0.05)] transition-[transform,box-shadow,border-color] duration-300 md:flex-row md:items-start md:gap-10 md:p-6 md:hover:-translate-y-1 md:hover:border-black/20 md:hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)] lg:gap-12"
				>
					<HandmadeCategoryPieceFrame
						frames={slideFrames(slide)}
						frameVariant={frameVariant}
						stagger={`${i * 0.11}s`}
						{pieceTitle}
						pieceIndex={i}
						eager={i < 3}
						paused={lightbox?.pieceIndex === i}
						onOpenLightbox={openLightbox}
					/>
					<div class="handmade-piece-info w-full min-w-0 flex-1">
						<p class="font-mono text-[9px] tracking-[0.35em] text-neutral-400 uppercase md:text-[10px]">
							{pieceLabel}
						</p>
						<h2 class="font-syne mt-3 font-bold tracking-tighter transition-transform duration-300 md:mt-4 md:group-hover:translate-x-0.5">
							{#if pieceTitleLines && pieceTitleLines.length === 2}
								<span class="block text-balance break-words text-xl leading-[1.1] sm:text-2xl md:text-3xl"
									>{pieceTitleLines[0]}:</span
								>
								<span
									class="mt-1.5 block text-balance break-words text-lg leading-snug text-neutral-800 sm:text-xl md:mt-2 md:text-2xl md:leading-tight"
								>
									{pieceTitleLines[1]}
								</span>
							{:else}
								<span class="block text-balance break-words text-xl sm:text-2xl md:text-3xl"
									>{pieceTitle}</span
								>
							{/if}
						</h2>
						{#if slide.description}
							<p
								class="mt-5 max-w-xl text-sm leading-relaxed text-neutral-700 md:mt-6 md:text-base"
							>
								{slide.description}
							</p>
						{:else}
							<p class="mt-5 max-w-xl text-sm leading-relaxed text-neutral-600 italic md:mt-6 md:text-base">
								{slide.alt}
							</p>
						{/if}
						<a
							href={instagramOrderUrl}
							target="_blank"
							rel="noopener noreferrer"
							class="font-syne group mt-6 inline-flex w-full items-center justify-center gap-2.5 border-2 border-black bg-black px-6 py-3 text-center text-[10px] font-bold tracking-[0.22em] text-white uppercase transition-[color,background-color,transform] duration-300 hover:bg-white hover:text-black hover:scale-[1.02] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black sm:w-auto sm:justify-start"
							aria-label={`Achiziționează pe Instagram: ${pieceTitle}`}
						>
							Achiziționează
							<ArrowUpRight
								class="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:rotate-45"
								aria-hidden="true"
							/>
						</a>
					</div>
				</article>
			{/each}
		</div>

		<div
			class="mt-16 flex flex-col items-start gap-6 border-t border-black/10 pt-12 md:mt-20 md:flex-row md:items-center md:justify-between md:pt-16"
		>
			<p class="max-w-md text-sm leading-relaxed text-neutral-600 md:text-base">
				Pentru o comandă unicat sau detalii despre materiale și termene, poți scrie direct pe Instagram.
			</p>
			<a
				href={instagramOrderUrl}
				target="_blank"
				rel="noopener noreferrer"
				class="font-syne inline-flex items-center gap-3 border-2 border-black bg-black px-8 py-4 text-[10px] font-bold tracking-[0.28em] text-white uppercase transition-colors duration-300 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
			>
				Comandă pe Instagram
				<ArrowUpRight class="h-4 w-4" aria-hidden="true" />
			</a>
		</div>
	</div>
</section>

{#if lightbox}
	{@const lbFrame = lightbox.frames[lightbox.index]}
	<!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
	<div
		class="handmade-lightbox-backdrop fixed inset-0 z-[300] flex items-center justify-center bg-black/86 p-4 backdrop-blur-[2px]"
		role="dialog"
		aria-modal="true"
		aria-label={`Vizualizare: ${lightbox.pieceTitle}`}
		tabindex="-1"
		onclick={(e) => {
			if (e.target === e.currentTarget) closeLightbox();
		}}
	>
		<div
			class="relative my-auto flex min-h-0 w-full max-w-[min(100vw-1rem,56rem)] flex-col sm:max-w-[min(96vw,56rem)]"
			onclick={(e) => e.stopPropagation()}
			role="presentation"
		>
			<button
				type="button"
				class="handmade-lightbox-close font-syne absolute -top-1 right-0 z-10 flex h-11 w-11 -translate-y-full items-center justify-center border-2 border-white bg-white text-black shadow-lg transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:-right-1"
				onclick={closeLightbox}
				aria-label="Închide"
			>
				<X class="h-5 w-5" aria-hidden="true" />
			</button>
			{#if lightbox.frames.length > 1}
				<button
					type="button"
					class="absolute top-1/2 left-0 z-10 flex h-12 w-12 -translate-x-1 -translate-y-1/2 items-center justify-center border-2 border-white/90 bg-white/95 text-black shadow-lg transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-14 md:w-14 md:-translate-x-3"
					onclick={() => lightboxStep(-1)}
					aria-label="Imaginea anterioară"
				>
					<ChevronLeft class="h-7 w-7 md:h-8 md:w-8" aria-hidden="true" />
				</button>
				<button
					type="button"
					class="absolute top-1/2 right-0 z-10 flex h-12 w-12 translate-x-1 -translate-y-1/2 items-center justify-center border-2 border-white/90 bg-white/95 text-black shadow-lg transition-colors hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:h-14 md:w-14 md:translate-x-3"
					onclick={() => lightboxStep(1)}
					aria-label="Imaginea următoare"
				>
					<ChevronRight class="h-7 w-7 md:h-8 md:w-8" aria-hidden="true" />
				</button>
			{/if}
			<div class="relative min-h-0 flex-1">
				<img
					src={lbFrame.src}
					alt={lbFrame.alt}
					class="max-h-[min(72vh,820px)] w-full rounded-sm object-contain shadow-2xl ring-1 ring-white/10"
					draggable="false"
				/>
			</div>
			<div
				class="mt-3 max-h-[32vh] w-full shrink-0 overflow-y-auto px-0.5 text-center sm:mt-4 sm:max-h-[28vh] md:mt-5 md:max-h-[22vh]"
			>
				<p class="font-syne text-sm font-bold leading-snug text-white sm:text-base md:text-lg">
					{lightbox.pieceTitle}
				</p>
				{#if lightbox.pieceDescription}
					<p class="mt-2 text-pretty text-left text-xs leading-relaxed text-white/85 sm:text-sm md:text-base">
						{lightbox.pieceDescription}
					</p>
				{:else}
					<p class="mt-2 text-pretty text-left text-xs leading-relaxed text-white/75 italic sm:text-sm md:text-base">
						{lbFrame.alt}
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}

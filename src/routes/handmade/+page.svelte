<script lang="ts">
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { resolve } from '$app/paths';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import Plus from 'lucide-svelte/icons/plus';
	import HandmadeProductCard from '$lib/handmade/HandmadeProductCard.svelte';
	import { handmadeCategories, handmadeCategoryNavLinks } from '$lib/handmade/gallery';

	let handmadeFabOpen = $state(false);

	function toggleHandmadeFab() {
		handmadeFabOpen = !handmadeFabOpen;
	}
</script>

<svelte:head>
	<title>Atelier — Colecție unicat handmade | Alexandra Crîsta</title>
	<meta
		name="description"
		content="Atelier Alexandra Crîsta — piese handmade la comandă: haine, inele, broșe."
	/>
</svelte:head>

<section class="relative overflow-x-hidden px-4 py-10 text-black sm:px-6 sm:py-16 md:px-24 md:py-20">
	<div class="mx-auto max-w-7xl">
		<div class="mb-16 border-b border-black/10 pb-10 sm:mb-24 sm:pb-14 md:mb-40 md:pb-16">
			<div class="mx-auto flex w-full max-w-none flex-col items-center text-center md:max-w-5xl lg:max-w-6xl">
				<h1
					class="mb-5 text-6xl leading-[0.82] font-black tracking-tighter uppercase sm:mb-8 sm:text-8xl md:text-[8.2rem] md:whitespace-nowrap lg:text-[clamp(6.25rem,12vw,11rem)]"
				>
					ATELIER
				</h1>
				<p class="font-mono text-sm tracking-[0.42em] text-neutral-500 uppercase italic sm:text-base md:text-lg">
					Colecție Unicat / Handmade
				</p>
			</div>
			<div
				class="magnetic-target mx-auto mt-20 flex w-full max-w-md flex-col items-center gap-4 md:mt-28 lg:mt-36"
				data-dist="0.2"
			>
				<span
					class="max-w-[19rem] text-center text-[10px] font-bold leading-relaxed tracking-[0.24em] text-neutral-700 uppercase"
				>
					Apasă + pentru categorii — Haine, Inele, Broșe
				</span>
				<div class="relative flex flex-col items-center">
					{#if handmadeFabOpen}
						<div
							id="handmade-fab-actions"
							class="mb-4 flex w-full min-w-[12rem] flex-col items-stretch gap-2.5 sm:min-w-[13.5rem]"
							role="group"
							aria-label="Categorii atelier handmade"
						>
							{#each handmadeCategoryNavLinks as item, i (item.id)}
								<div
									in:fly={{
										y: 14,
										duration: 280,
										delay: 45 + i * 58,
										easing: cubicOut
									}}
								>
									<a
										href={resolve(item.path)}
										class="handmade-fab-link group flex w-full items-center justify-center rounded-full border-2 border-black bg-white px-5 py-2.5 text-center text-[10px] font-bold tracking-[0.22em] text-black uppercase shadow-[0_6px_20px_rgba(0,0,0,0.1)] transition-[color,background-color,box-shadow,transform] duration-300 hover:bg-black hover:text-white hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[4px] focus-visible:outline-black active:scale-[0.98]"
										data-sveltekit-preload-data="hover"
										onclick={() => {
											handmadeFabOpen = false;
										}}
									>
										{item.label}
									</a>
								</div>
							{/each}
						</div>
					{/if}
					<button
						type="button"
						class="handmade-direct-btn group relative flex h-[4.75rem] w-[4.75rem] shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-black bg-white text-black shadow-[0_8px_32px_rgba(0,0,0,0.16)] transition-[color,background-color,box-shadow] duration-300 hover:bg-black hover:text-white hover:shadow-[0_16px_48px_rgba(0,0,0,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-black"
						aria-expanded={handmadeFabOpen}
						aria-controls="handmade-fab-actions"
						aria-haspopup="true"
						aria-label={handmadeFabOpen
							? 'Închide meniul categoriilor'
							: 'Deschide meniul — Haine, Inele, Broșe'}
						onclick={toggleHandmadeFab}
					>
						<Plus
							class="h-7 w-7 transition-transform duration-300 {handmadeFabOpen
								? 'rotate-45'
								: 'group-hover:rotate-90'}"
						/>
					</button>
				</div>
			</div>
		</div>

		<div
			class="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10"
		>
			{#each handmadeCategories as cat, i (cat.id)}
				<div
					class={handmadeCategories.length === 3 && i === 2
						? 'md:col-span-2 md:flex md:justify-center lg:col-span-1'
						: ''}
				>
					<div
						class={handmadeCategories.length === 3 && i === 2
							? 'w-full max-w-md lg:max-w-none'
							: 'w-full'}
					>
						<HandmadeProductCard
							serial={cat.serial}
							title={cat.title}
							priceLabel={cat.priceLabel}
							slides={cat.slides}
						/>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<footer
	class="relative isolate overflow-x-hidden bg-[#0a0a0a] px-4 pt-8 pb-[max(1.5rem,env(safe-area-inset-bottom,0px))] text-white sm:px-6 md:px-24 md:pt-12 md:pb-10"
	data-nav-bg="dark"
>
	<div
		class="pointer-events-none absolute right-0 bottom-1 z-0 max-w-[100vw] select-none overflow-hidden text-right font-mono text-[clamp(1.5rem,5vw,4rem)] font-black leading-none tracking-tighter text-white/[0.05] uppercase md:bottom-2 md:right-4"
		aria-hidden="true"
	>
		CONTACT
	</div>
	<div class="relative z-[1] mx-auto w-full max-w-7xl">
		<div
			class="mx-auto flex w-full max-w-[42rem] flex-col items-center gap-4 text-center text-pretty md:gap-5 lg:max-w-[46rem]"
		>
			<h2
				class="w-full min-w-0 text-balance break-words text-xl leading-[1.08] font-bold tracking-tighter uppercase sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
			>
				Pentru comandă sau detalii, scrie-mi direct pe Instagram.
			</h2>
			<a
				href="https://www.instagram.com/direct/t/17845325352021081/"
				target="_blank"
				rel="noopener noreferrer"
				class="group relative inline-flex items-center justify-center gap-4 border-2 border-white/40 px-8 py-4 text-[10px] font-bold tracking-[0.35em] uppercase shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-[border-color,background-color,color,box-shadow] duration-300 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px] focus-visible:outline-white md:px-10 md:py-5"
				aria-label="Scrie-i Alexandrei pe Instagram Direct"
			>
				Scrie-mi
				<ArrowUpRight class="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
			</a>
		</div>
	</div>
</footer>

<style>
	@keyframes handmade-direct-pulse {
		0%,
		100% {
			box-shadow:
				0 8px 32px rgba(0, 0, 0, 0.16),
				0 0 0 0 rgba(0, 0, 0, 0);
		}
		45% {
			box-shadow:
				0 8px 32px rgba(0, 0, 0, 0.16),
				0 0 0 10px rgba(0, 0, 0, 0.07);
		}
		55% {
			box-shadow:
				0 8px 32px rgba(0, 0, 0, 0.16),
				0 0 0 6px rgba(0, 0, 0, 0.04);
		}
	}
	.handmade-direct-btn {
		animation: handmade-direct-pulse 2.75s ease-in-out infinite;
	}
	.handmade-direct-btn:hover,
	.handmade-direct-btn:focus-visible {
		animation: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.handmade-direct-btn {
			animation: none;
		}
	}
</style>

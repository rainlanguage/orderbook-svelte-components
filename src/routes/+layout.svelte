<script lang="ts">
	import { initOrderbook } from '$lib';
	import { defaultEvmStores } from 'svelte-ethers-store';
	import { browser } from '$app/environment';
	import { configureChains } from '@wagmi/core';
	import { avalanche, mainnet, goerli, polygonMumbai } from '@wagmi/core/chains';
	import { createConfig, account } from 'svelte-wagmi-stores';
	import { Web3Modal } from '@web3modal/html';
	import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';

	initOrderbook({
		address: '0xd14c2ba8779c6c4fba0d0606f4ff65ecd4c5bb38',
		subgraphEndpoint: 'https://nhs-sg-router.hello-8ae.workers.dev/'
	});

	const connectWallet = async () => {
		defaultEvmStores.setProvider();
	};

	// all this boilerplate is from the web3modal docs
	const chains = [mainnet, avalanche, goerli, polygonMumbai];
	const projectId = import.meta.env.VITE_PROJECT_ID;

	const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

	// except here we're using createConfig form this package instead of wagmi
	const wagmiConfig = createConfig({
		autoConnect: true,
		connectors: w3mConnectors({ projectId, chains }),
		publicClient
	});

	const ethereumClient = new EthereumClient(wagmiConfig, chains);

	let web3modal: Web3Modal;

	// necessary if you're using SSR, because there's no window for the modal to attach to
	$: if (browser) {
		web3modal = new Web3Modal(
			{
				projectId,
				themeVariables: {
					'--w3m-logo-image-url':
						'https://uploads-ssl.webflow.com/627b9589504d3adc8db27d80/6283b4807a13aa6e4df650ee_RainProtocol_Logo%201.svg',
					'--w3m-background-color': '#000000'
				}
			},
			ethereumClient
		);
		web3modal.setDefaultChain(goerli);
	}
</script>

<button
	on:click={() => {
		web3modal.openModal();
	}}>CONNECT</button
>

<slot />

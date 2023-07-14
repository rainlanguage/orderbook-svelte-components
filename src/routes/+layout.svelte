<script lang="ts">
	import { initOrderbook } from '$lib';
	import { defaultEvmStores } from 'svelte-ethers-store';
	import { browser } from '$app/environment';
	import { configureChains } from '@wagmi/core'
	import { mainnet, polygon, polygonMumbai } from '@wagmi/core/chains'
	import { createConfig, account } from 'svelte-wagmi-stores';
	import { Web3Modal } from '@web3modal/html'
	import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'


	initOrderbook({
		address: '0xc4f5793594be6d258a1c6bcf4cd1e1806d250de4',
		subgraphEndpoint: 'https://polygon-mumbai.graph-eu.p2pify.com/0037829e0bd05058e24e8fdc64ba1fb0/oxtest'
	});	

	const connectWallet = async () => {
		defaultEvmStores.setProvider();
	};	


	// all this boilerplate is from the web3modal docs
	const chains = [mainnet, polygon, polygonMumbai]
	const projectId = import.meta.env.VITE_PROJECT_ID

	const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])

	// except here we're using createConfig form this package instead of wagmi
	const wagmiConfig = createConfig({
	autoConnect: true,
	connectors: w3mConnectors({ projectId, chains }),
	publicClient
	})

	const ethereumClient = new EthereumClient(wagmiConfig, chains)

	let web3modal: Web3Modal

	// necessary if you're using SSR, because there's no window for the modal to attach to
	$: if (browser) {
		web3modal = new Web3Modal(
			{ 
				projectId,
				themeVariables: {
					'--w3m-logo-image-url': 'https://uploads-ssl.webflow.com/627b9589504d3adc8db27d80/6283b4807a13aa6e4df650ee_RainProtocol_Logo%201.svg',
					'--w3m-background-color': '#000000',
				}
			},
			ethereumClient,
		)
		web3modal.setDefaultChain(polygonMumbai)
	}
</script>

<button on:click={()=>{web3modal.openModal()}}>CONNECT</button>

<slot />

import { gql } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';
import { ZORA_API_KEY } from '$env/static/private';
import { getSquigByAttribute } from '$lib/relatedSquigFetcher'


export const client = new GraphQLClient('https://api.zora.co/graphql', {
	'X-API-KEY': ZORA_API_KEY
});

const squigsMinted = 9675;

const attArray = [
	'Type',
	'Spectrum',
	'Color Direction',
	'Height',
	'Segments',
	'Steps Between',
	'Start Color',
	'End Color',
	'Color Spread'
];

const defaultQuery = gql`
	query SquigLookup {
		token(
			token: { address: "0x059edd72cd353df5106d2b9cc5ab83a52287ac3a", tokenId: "7744" }
			network: { chain: MAINNET, network: ETHEREUM }
		) {
			token {
				metadata
				owner
				mintInfo {
					toAddress
					mintContext {
						blockTimestamp
					}
				}
			}
		}
	}
`;

//get squig metadata from Zora, default returns random squig
export const getNewSquig = async (tokenId) => {
	//If none passed, get random squig.
	if (tokenId === undefined) {
		tokenId = Math.floor(Math.random() * squigsMinted);
	}

	//If user inputs OOB tokenID
	if (tokenId > squigsMinted || tokenId < 0) {
		try {
			const squig = await client.request(defaultQuery);
			return squig;
		} catch (error) {
			const defaultSquig = await client.request(defaultQuery);
			return defaultSquig;
		}
	}

	//If user inputs valid tokenID
	if (tokenId < squigsMinted) {
		try {
			const query = gql`
                query SquigLookup {
                  token(token: {address: "0x059edd72cd353df5106d2b9cc5ab83a52287ac3a", 
                  tokenId: "${tokenId}"}, 
                  network: {chain: MAINNET, network: ETHEREUM}) {
                    token {
                      metadata
                      owner
                      mintInfo {
                        toAddress
                        mintContext {
                          blockTimestamp
                        }
                      }
                    }
                  }
                }        
            `;
			const squig = await client.request(query);

			let reLinkIDs = {
				Type: '',
				Spectrum: '',
				'Color Direction': '',
				Height: '',
				Segments: '',
				'Steps Between': '',
				//CSV does not have below data yet. Replace when updated.
				'Start Color': '/',
				'End Color': '/',
				//CSV does not have above data yet. Replace when updated.
				'Color Spread': ''
			};

			for (let i = 0; i < attArray.length; i++) {
				let attTitle = attArray[i];
				let reLinkID = await getSquigByAttribute(
					attArray[i],
					squig.token.token.metadata.features[attArray[i]]
				);
				reLinkIDs[attTitle] = reLinkID;
			}

			squig.reLinkIDs = reLinkIDs;
			return squig;
		} catch (error) {
			const defaultSquig = await client.request(defaultQuery);
			return defaultSquig;
		}
	}
};

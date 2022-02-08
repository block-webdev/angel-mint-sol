import PropTypes from 'prop-types';
import bs58 from 'bs58';
// material
import { Box, Card, Link, Typography, Stack, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

import Label from '../../Label';
import { getFormattedPrice, decoratePubKey } from '../../../contexts/utils'
import {
  useModalContext
} from '../../../contexts/ProductModalContext';
import { InlineIcon } from '@iconify/react';

import IPFSUtils from '../../../utils/IPFSUtils';
import { mintNewNFT } from '../../../contexts/helpers';
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from 'react-toastify';

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

ShopProductCard.propTypes = {
  product: PropTypes.object
};


export default function ShopProductCard({ product }) {
  const { toggleModal, setNftModalInfo } = useModalContext();
  // const { last_price, listed_price, key_nft, hero_id, content_uri, image_uri, name, owner } = product;
  const file = product;
  const wallet = useWallet();

  const onDetailClick = () => {
    console.log("on detail click");
    setNftModalInfo(product);
    toggleModal();
  }

  // { "name": "Duck Sister #350", "symbol": "Sister", "description": "Duck Sister collection of 3333 NFT. Each duck is unique and is a sister to the Duck BRO!", "seller_fee_basis_points": 1000, "image": "https://www.arweave.net/K9oCZcT5WTMM6LReakfBwZ89unGkPdkkuGin_IUtSWg?ext=png", "external_url": "", "edition": 350, "attributes": [
  //   { "trait_type": "Background", "value": "Sakura" },
  //   { "trait_type": "Body", "value": "Beige" },
  //   { "trait_type": "Beak", "value": "Relaxed" },
  //   { "trait_type": "Clothing", "value": "Suit of the future" },
  //   { "trait_type": "Outline", "value": "Outline" },
  //   { "trait_type": "Hairstyle", "value": "Ponytail" },
  //   { "trait_type": "Eyes", "value": "Sadness" }
  // ],
  // "properties": {
  //   "files": [{ "uri": "image.png", "type": "image/png" }],
  //   "category": "image",
  //   "creators": [{ "address": "3EW3i59cropMTtjsKxPjvwC9dwCmwU1Dcbe2uuwE8DLW", "share": 100 }] 
  // }
  // }


  const onMintClick = () => {
    if (!wallet || !wallet.publicKey) {
      toast.error('Connect your Wallet', {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        type: toast.TYPE.ERROR,
        theme: 'colored'
      });
      return;
    }


    toast.success('Waiting...', {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      type: toast.TYPE.INFO,
      theme: 'colored'
    });

    IPFSUtils.uploadFileToIPFS([file]).then((lists) => {
      if (lists.length > 0) {
        const content_uri1 = {
          name: 'Angel1',
          symbol: 'angel1',
          image: lists[0],
          properties: {
            files: [{ uri: "image.png", type: "image/png" }],
            category: "image",
          }
        }

        IPFSUtils.uploadTextToIPFS(content_uri1).then((path) => {
          mintNewNFT({ name: 'Angel', content_uri: path }, wallet).then(() => {
            toast.success('Succeed', {
              position: "bottom-left",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              type: toast.TYPE.SUCCESS,
              theme: 'colored'
            });
          });
        })
      }
    });
  }

  return (
    <Card>
      <Typography variant="subtitle2" noWrap mt={2} ml={1} style={{ textAlign: 'left' }} >
        NFT art
      </Typography>

      <Box sx={{ pt: '100%', position: 'relative' }}>

        <Link href={''} target="_blank">
          <ProductImgStyle alt={''} src={URL.createObjectURL(file)} />
        </Link>
      </Box>

      <Stack spacing={1} sx={{ p: 3 }}>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            0.7 SOL
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Button
            variant="contained"
            onClick={() => { onMintClick() }}
          >
            Mint
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

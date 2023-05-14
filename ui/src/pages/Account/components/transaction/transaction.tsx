import {
  Button,
  CardActions,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import React, { useEffect, useCallback } from 'react';
import { EthersTransactionRequest } from '../../../Background/services/provider-bridge';
import { TransactionComponentProps } from '../types';

import useAccountApi from '../../useAccountApi';

import { startAuthentication } from '@simplewebauthn/browser';
import { VerifyAuthenticationResponseOpts, verifyAuthenticationResponse } from '@simplewebauthn/server';
import { generateChallenge, isoBase64URL, isoUint8Array, toHash, decodeCredentialPublicKey, cose } from '@simplewebauthn/server/helpers';
import { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON, AuthenticatorDevice } from '@simplewebauthn/typescript-types';

const Transaction = ({
  transaction,
  onComplete,
  onReject,
}: TransactionComponentProps) => {

  const [loader, setLoader] = React.useState<boolean>(false);
  const { result, loading, callAccountApi } = useAccountApi();

  useEffect(() => {
    callAccountApi('getCredentials', [transaction]);
  }, [callAccountApi, transaction]);

  const onCompleteClick = useCallback(async() => {
    if (result) {
      const rpId = chrome.runtime.id;  // get the chrome extension ID as domain
      
      const authChallenge: string = isoBase64URL.fromBuffer(generateChallenge());

      const authOptions: PublicKeyCredentialRequestOptionsJSON = {
        "challenge": authChallenge,
        "allowCredentials": [
          {
            "id": result.credentialId,                              // limit to the previous device registered
            "type": "public-key"
          }
        ],
        "timeout": 60000,
        "userVerification": "required",
        "rpId": rpId
      };

      // start client-side authentication
      const authResponse = await startAuthentication(authOptions);
      console.log(authResponse);

      // verify the signature
      const authDataBuffer = isoBase64URL.toBuffer(authResponse.response.authenticatorData);
      const signature = isoBase64URL.toBuffer(authResponse.response.signature);
      const clientDataHash = await toHash(isoBase64URL.toBuffer(authResponse.response.clientDataJSON));
      const message = isoUint8Array.concat([authDataBuffer, clientDataHash]);
      const coseOKPPublicKey = decodeCredentialPublicKey(isoBase64URL.toBuffer(result.credentialPublicKey)) as cose.COSEPublicKeyOKP;  // assumed Ed25519
      if (coseOKPPublicKey) {
        // complete gathering the signature information for wallet contract to verify
        onComplete(transaction, {
          signature: isoBase64URL.toBuffer(authResponse.response.signature),
          message: isoUint8Array.concat([authDataBuffer, clientDataHash]),
          publicKey: coseOKPPublicKey.get(cose.COSEKEYS.x)
        });

        setLoader(true);
      }
    }
  }, [result]);

  return (
    <>
      <CardContent>
        <Typography variant="h3" gutterBottom>
          Dummy Account Component
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You can show as many steps as you want in this dummy component. You
          need to call the function <b>onComplete</b> passed as a props to this
          component. <br />
          <br />
          The function takes a modifiedTransactions & context as a parameter,
          the context will be passed to your AccountApi when creating a new
          account. While modifiedTransactions will be agreed upon by the user.
          <br />
          This Component is defined in exported in{' '}
        </Typography>
        <Typography variant="caption">
          trampoline/src/pages/Account/components/transaction/index.ts
        </Typography>
      </CardContent>
      <CardActions sx={{ pl: 4, pr: 4, width: '100%' }}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Button
            disabled={loader}
            size="large"
            variant="contained"
            onClick={onCompleteClick}
          >
            Continue
            {loader && (
              <CircularProgress
                size={24}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Button>
        </Stack>
      </CardActions>
    </>
  );
};

export default Transaction;

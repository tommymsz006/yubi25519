import {
  Box,
  Button,
  CardActions,
  CardContent,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import React from 'react';
import { OnboardingComponent, OnboardingComponentProps } from '../types';

import { startRegistration } from '@simplewebauthn/browser';
import { VerifyRegistrationResponseOpts, verifyRegistrationResponse } from '@simplewebauthn/server';
import { generateChallenge, isoBase64URL } from '@simplewebauthn/server/helpers';
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';


import onboardingImg from '../../../../assets/img/onboarding.jpg';

const Onboarding: OnboardingComponent = ({
  onOnboardingComplete,
}: OnboardingComponentProps) => {

  async function onCompleteClick(e) {

    const rpId = chrome.runtime.id;  // get the chrome extension ID as domain
    const expectedRpId = `chrome-extension://${rpId}`;  // as a non-standard, 'chrome-extension://' prefix is added to differentiate with traditional domain names
    const regChallenge: string = isoBase64URL.fromBuffer(generateChallenge());

    const regOptions: PublicKeyCredentialCreationOptionsJSON = {
      "challenge": regChallenge,
      "rp": {
        "name": "YubiCastle",
        "id": rpId,
      },
      "user": {
        "id": "internalUserId",
        "name": `user@${rpId}`,
        "displayName": `user@${rpId}`
      },
      "pubKeyCredParams": [
        //{
        //  "alg": -7,  // ES256
        //  "type": "public-key"
        //},
        {
          "alg": -8,  // Ed25519
          "type": "public-key"
        },
      ],
      "timeout": 60000,
      "attestation": "none",
      "excludeCredentials": [],
      "authenticatorSelection": {
        "residentKey": "required",
        "userVerification": "required",
        "authenticatorAttachment": "cross-platform",
        "requireResidentKey": true
      },
      "extensions": {
        "credProps": true
      }
    };

    const regResponse = await startRegistration(regOptions);

    const verifyRegOptions: VerifyRegistrationResponseOpts = {
      response: regResponse,
      expectedChallenge: regChallenge,
      expectedOrigin: origin,
      expectedRPID: expectedRpId,
      requireUserVerification: true,
    };

    console.log(verifyRegOptions);

    const verification = await verifyRegistrationResponse(verifyRegOptions);
    console.log(verification);
    // store registrationInfo.credentialID (device identifier) and registrationInfo.credentialPublicKey (public key verify authn later)

    if (verification.verified && verification.registrationInfo) {
      console.log('onOnboardingComplete');
      // mark onboarding complete and save the auth device obtained
      onOnboardingComplete({
        credentialId: isoBase64URL.fromBuffer(verification.registrationInfo.credentialID),
        credentialPublicKey: isoBase64URL.fromBuffer(verification.registrationInfo.credentialPublicKey)
      });
    }
  }

  return (
    <Box sx={{ padding: 2 }}>
      <CardContent>
        <Typography variant="h4" gutterBottom>
          Register your YubiKey
        </Typography>
        <Stack spacing={1} justifyContent="center" alignItems="center">
          <img
            height={200}
            src={onboardingImg}
            alt='Onboarding'
          />
          <Typography variant="body1" color="text.secondary">
            Get ready! Put your YubiKey in the appropriate slot, and follow the instructions to enter PIN then tap.<br />
          </Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{ pl: 4, pr: 4, width: '100%' }}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Button
            size="large"
            variant="contained"
            onClick={onCompleteClick}
          >
            I'm ready
          </Button>
        </Stack>
      </CardActions>
    </Box>
  );
};

export default Onboarding;

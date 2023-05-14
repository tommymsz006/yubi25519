import React from 'react';
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import main from '../../../../assets/img/main.jpg';
import { useNavigate } from 'react-router-dom';

const Intro = () => {
  const navigate = useNavigate();

  return (
    <Stack
      spacing={2}
      sx={{ height: '100%' }}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        component="span"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          width: 600,
          p: 2,
          border: '1px solid #d6d9dc',
          borderRadius: 5,
          background: 'white',
        }}
      >
        <CardContent>
          <Typography textAlign="center" variant="h4" gutterBottom>
            Welcome to Yubi Castle!
          </Typography>
          <Typography textAlign="center" variant="body1" color="text.secondary">
            Bring the YubiKey you use everyday in the Web3 world
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ p: 5 }}
          >
            <img height={300} src={main} className="App-logo" alt="logo" />
          </Box>
        </CardContent>
        <CardActions sx={{ pl: 4, pr: 4, width: '100%' }}>
          <Stack spacing={2} sx={{ width: '100%' }}>
            <Button
              size="large"
              variant="contained"
              onClick={() => navigate('/accounts/new')}
            >
              Let's get started
            </Button>
          </Stack>
        </CardActions>
      </Box>
    </Stack>
  );
};

export default Intro;

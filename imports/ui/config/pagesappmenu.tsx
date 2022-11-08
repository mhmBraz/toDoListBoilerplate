import React from 'react';
import { isMobile } from '/imports/libs/deviceVerify';
import Home from '@mui/icons-material/Home';

export const pagesMenuItemList = [
    isMobile
        ? {
              path: '/',
              name: 'Home',
              icon: <Home />,
          }
        : null,
].filter((x) => !!x);

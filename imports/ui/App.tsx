import React from 'react';
import AppLayoutFixedMenu from './layouts/appLayoutFixedMenu.tsx';
import GeneralComponents, { AppContext } from './AppGeneralComponents';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import { getTheme, theme } from '/imports/materialui/theme';
import { userAccount } from '/imports/hooks/userAccount';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';

const AppContainer = () => {
    const { isLoggedIn, user, userLoading } = userAccount();

    const context = React.useContext(AppContext);
    const theme = useTheme();
    return (
        <AppLayoutFixedMenu
            {...context}
            user={user}
            isLoggedIn={isLoggedIn}
            userLoading={userLoading}
            theme={theme}
        />
    );
};

export const App = () => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const [darkThemeMode, setDarkThemeMode] = React.useState(!!prefersDarkMode);
    const [fontScale, setFontScale] = React.useState(1);
    const isMobile = useMediaQuery('(max-width:600px)');

    const themeOptions = {
        darkMode: darkThemeMode,
        fontScale,
        isMobile,
    };

    return (
        <ThemeProvider theme={getTheme(themeOptions)}>
            <CssBaseline enableColorScheme />
            <GeneralComponents
                themeOptions={{
                    isMobile,
                    setFontScale,
                    fontScale,
                    setDarkThemeMode,
                    isDarkThemeMode: !!darkThemeMode,
                }}
            >
                <AppContainer isMobile={isMobile} />
            </GeneralComponents>
        </ThemeProvider>
    );
};

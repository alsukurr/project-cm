import './oauth.page.scss';

import { useQuery } from '@apollo/react-hooks';
import { EOauthCallbackInput, ETokenResult } from 'cm-api';
import qs from 'query-string';
import React, { useMemo } from 'react';

import { Page } from '../../components/Page/Page';
import { AuthContainer } from '../../containers/Auth.container';
import logo from '../../images/logo.png';
import { oauthCallback } from '../../lib/API/queries';
import { history } from '../../router/history';


export const OAuthPage: React.FunctionComponent = () => {
  const { code } = qs.parse(document.location.search);
  const { setToken } = AuthContainer.useContainer();

  const { loading, data, error } = useQuery <
    { oauthCallback: ETokenResult },
    { details: EOauthCallbackInput }>(oauthCallback, {
      variables: {
        details: {
          code: code as string,
          provider: 'github'
        }
      }
    });

  if (!loading && data && data.oauthCallback.accessToken) {
    setToken(data.oauthCallback.accessToken);
    history.push('/');
  }

  const uiError = useMemo(() => {
    if (error) return error.graphQLErrors[0].message;
    return null;
  }, [error]);

  return <Page type="oauth" title="Logging in">
    <div>
      <img alt="logo" src={logo} />
      {loading
        ? <span>Logging in...</span>
        : uiError
          ? <span>{uiError}</span>
          : <span>Successfully logged in!</span>
      }
    </div>
  </Page>;
};

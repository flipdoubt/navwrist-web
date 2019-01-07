import * as React from 'react';
import { Route } from 'react-router-dom';
import Home from './components/Home/Page';

export const routes = <React.Fragment>
    <Route exact path='/' component={ Home } />
</React.Fragment>;

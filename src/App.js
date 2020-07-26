import React from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import TopPage from './pages/top';
import Archive from './pages/archive';
import NotFound from './pages/404';
import 'antd/dist/antd.css';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Redirect to="/top" />
        </Route>
        <Route exact path="/top" component={TopPage} />
        <Route path="/archive/:id" component={Archive} />
        <Route exact component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;

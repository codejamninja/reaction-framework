import 'babel-polyfill';
import ReactRouter from '@reactant/react-router';
import Redux from '@reactant/redux';
import StyledComponents from '@reactant/styled-components';
import { App } from '@reactant/web';
import ClientRoot from './ClientRoot';

const app = new App(ClientRoot);
app.register(ReactRouter);
app.register(Redux);
app.register(StyledComponents);

export default app.init();

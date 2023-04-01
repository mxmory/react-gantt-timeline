import React from 'react';
import ReactDOM from 'react-dom/client';
import Roadmap from './Roadmap';
import './index.css';
import { ACTUAL_DATA } from './constants';

ReactDOM.createRoot(document.getElementById('root')).render(<Roadmap data={ACTUAL_DATA} />);

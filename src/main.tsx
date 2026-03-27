import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from '@/app/providers/query-provider';
import { router } from '@/app/router/router';
import './index.css';
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryProvider>
			<RouterProvider router={router} />
		</QueryProvider>
	</React.StrictMode>,
);


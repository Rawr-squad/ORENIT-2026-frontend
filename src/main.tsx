import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { App, ConfigProvider } from 'antd';
import { QueryProvider } from '@/app/providers/query-provider';
import { router } from '@/app/router/router';
import { antdTheme } from '@/shared/config/theme';
import 'antd/dist/reset.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<ConfigProvider theme={antdTheme}>
			<App>
				<QueryProvider>
					<RouterProvider router={router} />
				</QueryProvider>
			</App>
		</ConfigProvider>
	</React.StrictMode>,
);

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { palette } from '@/shared/config/theme';

type Props = {
	content: string;
};

export const Markdown = ({ content }: Props) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				h1: ({ children }) => (
					<h1 style={{ color: palette.navy, fontSize: 28, marginTop: 4, marginBottom: 12 }}>
						{children}
					</h1>
				),
				h2: ({ children }) => (
					<h2 style={{ color: palette.navy, fontSize: 24, marginBottom: 10 }}>{children}</h2>
				),
				h3: ({ children }) => (
					<h3 style={{ color: palette.navy, fontSize: 20, marginBottom: 8 }}>{children}</h3>
				),
				p: ({ children }) => (
					<p style={{ color: palette.navy, lineHeight: 1.6, marginBottom: 10 }}>{children}</p>
				),
				li: ({ children }) => (
					<li style={{ color: palette.navy, lineHeight: 1.6 }}>{children}</li>
				),
				code: ({ children, className }) => {
					const value = String(children ?? '');
					const isBlock = Boolean(className?.includes('language-')) || value.includes('\n');

					if (!isBlock) {
						return (
							<code
								style={{
									background: '#FFF7C7',
									padding: '2px 6px',
									borderRadius: 6,
									border: `1px solid ${palette.primary}`,
								}}
							>
								{children}
							</code>
						);
					}

					return (
						<pre
							style={{
								whiteSpace: 'pre-wrap',
								background: '#FFF7C7',
								padding: 12,
								borderRadius: 12,
								border: `1px solid ${palette.primary}`,
								overflowX: 'auto',
							}}
						>
							<code>{children}</code>
						</pre>
					);
				},
			}}
		>
			{content}
		</ReactMarkdown>
	);
};
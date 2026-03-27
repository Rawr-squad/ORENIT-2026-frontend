import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Typography } from 'antd';

const { Title, Paragraph, Text } = Typography;

type Props = {
	content: string;
};

export const Markdown = ({ content }: Props) => {
	return (
		<ReactMarkdown
			remarkPlugins={[remarkGfm]}
			components={{
				h1: ({ children }) => <Title level={2}>{children}</Title>,
				h2: ({ children }) => <Title level={3}>{children}</Title>,
				h3: ({ children }) => <Title level={4}>{children}</Title>,
				p: ({ children }) => <Paragraph>{children}</Paragraph>,
				strong: ({ children }) => <Text strong>{children}</Text>,
				code: ({ children }) => (
					<pre style={{ background: '#f5f5f5', padding: 12 }}>
						<code>{children}</code>
					</pre>
				),
			}}
		>
			{content}
		</ReactMarkdown>
	);
};

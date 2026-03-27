import MDEditor from '@uiw/react-md-editor/nohighlight';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

type MarkdownEditorProps = {
	value?: string;
	onChange?: (value: string) => void;
	height?: number;
	placeholder?: string;
};

export const MarkdownEditor = ({
	value,
	onChange,
	height = 260,
	placeholder,
}: MarkdownEditorProps) => {
	return (
		<div data-color-mode='light'>
			<MDEditor
				value={value ?? ''}
				onChange={(nextValue) => onChange?.(nextValue ?? '')}
				preview='live'
				height={height}
				visibleDragbar={false}
				textareaProps={{ placeholder }}
			/>
		</div>
	);
};
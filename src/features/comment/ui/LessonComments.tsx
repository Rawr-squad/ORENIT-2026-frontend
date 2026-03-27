import {
	Alert,
	App,
	Button,
	Card,
	Empty,
	Input,
	Space,
	Spin,
	Typography,
} from 'antd';
import { useMemo, useState } from 'react';
import type { LessonComment } from '@/entities/comment/model/comment.types';
import { useCreateComment } from '../api/useCreateComment';
import { useLessonComments } from '../api/useLessonComments';
import { palette } from '@/shared/config/theme';
import { UserIdentity } from '@/shared/ui/user/UserIdentity';
import { useAuthStore } from '@/entities/user/model/auth.store';

const { Text } = Typography;

type Props = {
	lessonId: number;
};

const formatDate = (value?: string) => {
	if (!value) {
		return '';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return value;
	}

	return date.toLocaleString();
};

const CommentNode = ({
	comment,
	depth,
	activeReplyId,
	replyDraft,
	onReplyDraftChange,
	onOpenReply,
	onSubmitReply,
	isSubmitting,
}: {
	comment: LessonComment;
	depth: number;
	activeReplyId: number | null;
	replyDraft: string;
	onReplyDraftChange: (value: string) => void;
	onOpenReply: (id: number | null) => void;
	onSubmitReply: (comment: LessonComment) => void;
	isSubmitting: boolean;
}) => {
	const marginLeft = Math.min(64, depth * 20);

	return (
		<div style={{ marginTop: depth === 0 ? 0 : 10, marginLeft }}>
			<Card size='small' style={{ borderColor: palette.borderSoft }}>
				<Space orientation='vertical' size={6} style={{ width: '100%' }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							gap: 10,
							flexWrap: 'wrap',
						}}
					>
						<UserIdentity
							nickname={comment.user_nickname}
							nicknameColor={comment.user_nickname_color}
							customStatus={comment.user_custom_status}
							avatarUrl={comment.user_avatar_url}
							size={28}
						/>
						{comment.created_at && (
							<Text style={{ color: palette.textSecondary, fontSize: 12 }}>
								{formatDate(comment.created_at)}
							</Text>
						)}
					</div>
					<Text style={{ color: palette.navy }}>{comment.content}</Text>
					<Button
						type='link'
						style={{ padding: 0, width: 'fit-content' }}
						onClick={() =>
							onOpenReply(activeReplyId === comment.id ? null : comment.id)
						}
					>
						Ответить
					</Button>
					{activeReplyId === comment.id && (
						<Space orientation='vertical' style={{ width: '100%' }}>
							<Input.TextArea
								rows={2}
								value={replyDraft}
								onChange={(event) => onReplyDraftChange(event.target.value)}
								placeholder='Введите ответ...'
							/>
							<Button
								type='primary'
								disabled={!replyDraft.trim() || isSubmitting}
								loading={isSubmitting}
								onClick={() => onSubmitReply(comment)}
								style={{
									color: palette.navy,
									fontWeight: 700,
									width: 'fit-content',
								}}
							>
								Отправить ответ
							</Button>
						</Space>
					)}
				</Space>
			</Card>

			<Space orientation='vertical' style={{ width: '100%', marginTop: 8 }}>
				{comment.replies.map((reply) => (
					<CommentNode
						key={reply.id}
						comment={reply}
						depth={depth + 1}
						activeReplyId={activeReplyId}
						replyDraft={replyDraft}
						onReplyDraftChange={onReplyDraftChange}
						onOpenReply={onOpenReply}
						onSubmitReply={onSubmitReply}
						isSubmitting={isSubmitting}
					/>
				))}
			</Space>
		</div>
	);
};

export const LessonComments = ({ lessonId }: Props) => {
	const { message } = App.useApp();
	const commentsQuery = useLessonComments(lessonId);
	const createComment = useCreateComment();
	const user = useAuthStore((s) => s.user);
	const [newComment, setNewComment] = useState('');
	const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
	const [replyDraft, setReplyDraft] = useState('');

	const comments = useMemo(
		() => commentsQuery.data ?? [],
		[commentsQuery.data],
	);

	const submitRootComment = () => {
		const content = newComment.trim();
		if (!content) {
			return;
		}

		createComment.mutate(
			{
				lesson_id: lessonId,
				content,
				parent_id: null,
			},
			{
				onSuccess: () => {
					setNewComment('');
				},
				onError: () => {
					message.error('Не удалось отправить комментарий');
				},
			},
		);
	};

	const submitReply = (comment: LessonComment) => {
		const content = replyDraft.trim();
		if (!content) {
			return;
		}

		createComment.mutate(
			{
				lesson_id: lessonId,
				content,
				parent_id: comment.id,
			},
			{
				onSuccess: () => {
					setReplyDraft('');
					setActiveReplyId(null);
				},
				onError: () => {
					message.error('Не удалось отправить ответ');
				},
			},
		);
	};

	if (commentsQuery.isLoading) {
		return <Spin style={{ marginTop: 12 }} />;
	}

	if (commentsQuery.isError) {
		return (
			<Alert
				type='error'
				message='Не удалось загрузить комментарии'
				style={{ marginTop: 12 }}
			/>
		);
	}

	return (
		<Card title='Комментарии' style={{ borderColor: palette.pink, marginTop: 16 }}>
			<Space orientation='vertical' style={{ width: '100%' }} size={12}>
				<Space align='start' style={{ width: '100%' }}>
					<UserIdentity
						nickname={user?.nickname}
						nicknameColor={user?.nickname_color}
						customStatus={user?.custom_status}
						avatarUrl={user?.avatar_url}
						size={32}
					/>
					<Space
						size={10}
						style={{
							display: 'flex',
							flexDirection: 'column',
							width: '100%',
						}}
					>
						<Input.TextArea
							rows={3}
							style={{ width: '100%' }}
							placeholder='Напишите комментарий к заданию...'
							value={newComment}
							onChange={(event) => setNewComment(event.target.value)}
						/>
						<Button
							type='primary'
							disabled={!newComment.trim() || createComment.isPending}
							loading={createComment.isPending}
							onClick={submitRootComment}
							style={{
								color: palette.navy,
								fontWeight: 700,
								width: 'fit-content',
							}}
						>
							Отправить комментарий
						</Button>
					</Space>
				</Space>

				{comments.length === 0 && <Empty description='Комментариев пока нет' />}
				{comments.map((comment) => (
					<CommentNode
						key={comment.id}
						comment={comment}
						depth={0}
						activeReplyId={activeReplyId}
						replyDraft={replyDraft}
						onReplyDraftChange={setReplyDraft}
						onOpenReply={(id) => {
							setActiveReplyId(id);
							if (id === null) {
								setReplyDraft('');
							}
						}}
						onSubmitReply={submitReply}
						isSubmitting={createComment.isPending}
					/>
				))}
			</Space>
		</Card>
	);
};


import {
	Alert,
	App,
	Button,
	Empty,
	Input,
	List,
	Space,
	Spin,
	Tag,
	Typography,
} from 'antd';
import { useState } from 'react';
import { usePendingCodeAttempts } from '@/features/admin/review/api/usePendingCodeAttempts';
import { useReviewCodeAttempt } from '@/features/admin/review/api/useReviewCodeAttempt';
import { palette } from '@/shared/config/theme';
import { Markdown } from '@/shared/ui/Markdown';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { UserIdentity } from '@/shared/ui/user/UserIdentity';
import { BaseCard } from '@/shared/ui/card/BaseCard';

const { Text } = Typography;

const parseCodeAnswer = (answer: string) => {
	try {
		const parsed = JSON.parse(answer) as { code?: string; language?: string };
		if (typeof parsed?.code === 'string' && parsed.code.length > 0) {
			return {
				language: parsed.language?.trim() || 'код',
				code: parsed.code,
			};
		}
	} catch {
		// noop
	}

	const fencedMatch = answer.match(
		/^```([a-z0-9#+-]+)?\r?\n([\s\S]*?)\r?\n```$/i,
	);
	if (fencedMatch) {
		return {
			language: fencedMatch[1]?.trim() || 'код',
			code: fencedMatch[2] ?? '',
		};
	}

	return {
		language: 'текст',
		code: answer,
	};
};

export const AdminProfilePage = () => {
	const { message } = App.useApp();
	const pending = usePendingCodeAttempts();
	const review = useReviewCodeAttempt();
	const [feedbackByAttempt, setFeedbackByAttempt] = useState<
		Record<number, string>
	>({});

	if (pending.isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (pending.isError) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить кодовые задания на проверке'
			/>
		);
	}

	return (
		<div>
			<PageHeader
				title='Центр проверки кода'
				subtitle='Проверяйте решения учеников и отмечайте результат'
				rightSlot={
					<Tag color='processing'>{pending.data?.length ?? 0} на проверке</Tag>
				}
			/>
			<div style={{ padding: 24 }}>
				<BaseCard>
					{(pending.data ?? []).length === 0 ? (
						<Empty description='Нет отправленных кодовых решений на проверке' />
					) : (
						<List
							dataSource={pending.data}
							renderItem={(attempt) => {
								const parsedAnswer = parseCodeAnswer(attempt.answer);

								return (
									<List.Item>
										<BaseCard style={{ width: '100%' }}>
											<Space
												orientation='vertical'
												size={10}
												style={{ width: '100%' }}
											>
												<Space wrap>
													<Tag>Попытка #{attempt.id}</Tag>
													<Tag color='blue'>Задание #{attempt.task_id}</Tag>
												</Space>

												<UserIdentity
													nickname={attempt.user_nickname}
													nicknameColor={attempt.user_nickname_color}
													customStatus={attempt.user_custom_status}
													avatarUrl={attempt.user_avatar_url}
													subtitle={attempt.created_at}
												/>

												{attempt.task_question && (
													<div>
														<Text strong style={{ color: palette.navy }}>
															Задание:
														</Text>
														<div style={{ marginTop: 6 }}>
															<Markdown content={attempt.task_question} />
														</div>
													</div>
												)}

												<div>
													<Tag color='purple'>{parsedAnswer.language}</Tag>
													<pre
														style={{
															margin: '8px 0 0',
															padding: 12,
															borderRadius: 10,
															background: '#f8f9fc',
															whiteSpace: 'pre-wrap',
															wordBreak: 'break-word',
															fontFamily:
																"'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
														}}
													>
														{parsedAnswer.code}
													</pre>
												</div>

												<Input.TextArea
													rows={2}
													placeholder='Комментарий к задаче (необязательно)'
													value={feedbackByAttempt[attempt.id] ?? ''}
													onChange={(event) => {
														setFeedbackByAttempt((prev) => ({
															...prev,
															[attempt.id]: event.target.value,
														}));
													}}
												/>
												<Space>
													<Button
														type='primary'
														style={{ color: palette.navy, fontWeight: 700 }}
														disabled={review.isPending}
														onClick={() => {
															review.mutate(
																{
																	attemptId: attempt.id,
																	isCorrect: true,
																	feedback: feedbackByAttempt[attempt.id],
																},
																{
																	onSuccess: () => {
																		message.success('Отмечено как верное');
																		setFeedbackByAttempt((prev) => {
																			const next = { ...prev };
																			delete next[attempt.id];
																			return next;
																		});
																	},
																	onError: () =>
																		message.error(
																			'Не удалось отправить проверку',
																		),
																},
															);
														}}
													>
														Верно
													</Button>
													<Button
														danger
														disabled={review.isPending}
														onClick={() => {
															review.mutate(
																{
																	attemptId: attempt.id,
																	isCorrect: false,
																	feedback: feedbackByAttempt[attempt.id],
																},
																{
																	onSuccess: () => {
																		message.success('Отмечено как неверное');
																		setFeedbackByAttempt((prev) => {
																			const next = { ...prev };
																			delete next[attempt.id];
																			return next;
																		});
																	},
																	onError: () =>
																		message.error(
																			'Не удалось отправить проверку',
																		),
																},
															);
														}}
													>
														Неверно
													</Button>
												</Space>
											</Space>
										</BaseCard>
									</List.Item>
								);
							}}
						/>
					)}
				</BaseCard>
			</div>
		</div>
	);
};


import {
	Alert,
	App,
	Button,
	Col,
	Form,
	Input,
	Progress,
	Row,
	Spin,
	Statistic,
	Typography,
} from 'antd';
import { useLinkChild } from '@/features/parent/api/useLinkChild';
import { useProgress } from '@/features/progress/api/useProgress';
import { palette } from '@/shared/config/theme';
import { PageHeader } from '@/shared/ui/layout/PageHeader';
import { BaseCard } from '@/shared/ui/card/BaseCard';

const { Text } = Typography;

export const ParentProgressPage = () => {
	const { message } = App.useApp();
	const progress = useProgress();
	const linkChild = useLinkChild();
	const [form] = Form.useForm<{ parent_email: string }>();

	if (progress.isLoading) {
		return <Spin style={{ marginTop: 48, marginLeft: 24 }} />;
	}

	if (progress.isError || !progress.data) {
		return (
			<Alert
				style={{ margin: 24 }}
				type='error'
				message='Не удалось загрузить прогресс ребенка'
			/>
		);
	}

	const percent = progress.data.xp % 100;

	return (
		<div>
			<PageHeader
				title='Прогресс ребенка'
				subtitle='Отслеживайте рост XP и динамику обучения'
			/>

			<div style={{ padding: 24 }}>
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={12}>
						<BaseCard title='Прогресс'>
							<Progress
								type='circle'
								percent={percent}
								strokeColor={palette.purple}
							/>
							<div style={{ marginTop: 16 }}>
								<Statistic title='Общий XP' value={progress.data.xp} />
								<Statistic
									title='Завершенные уроки'
									value={progress.data.completed_lessons}
								/>
							</div>
						</BaseCard>
					</Col>
				</Row>
			</div>
		</div>
	);
};


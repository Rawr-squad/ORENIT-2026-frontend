import { Button, Form, Input, Card, Typography } from 'antd';
import { useRegister } from '@/features/auth/api/useRegister';

const { Title } = Typography;

export const RegisterPage = () => {
  const register = useRegister();

  const onFinish = (values: any) => {
    register.mutate(values);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
      <Card style={{ width: 350 }}>
        <Title level={3}>Register</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" required>
            <Input />
          </Form.Item>

          <Form.Item name="password" label="Password" required>
            <Input.Password />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={register.isPending}
            block
          >
            Register
          </Button>
        </Form>
      </Card>
    </div>
  );
};
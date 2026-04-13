import { Form, Input, Button, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const FormPage = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log('Form values:', values);
    alert('Форма успешно отправлена! Проверьте консоль.');
  };

  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <Card>
        <Title level={2}>Форма</Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: '',
            email: '',
            message: ''
          }}
        >
          <Form.Item
            label="Имя"
            name="name"
            rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
          >
            <Input placeholder="Введите ваше имя" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Пожалуйста, введите email!' },
              { type: 'email', message: 'Пожалуйста, введите корректный email!' }
            ]}
          >
            <Input placeholder="Введите ваш email" />
          </Form.Item>

          <Form.Item
            label="Сообщение"
            name="message"
            rules={[{ required: true, message: 'Пожалуйста, введите сообщение!' }]}
          >
            <Input.TextArea rows={4} placeholder="Введите ваше сообщение" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Отправить
            </Button>
            <Button 
              style={{ marginLeft: '8px' }} 
              onClick={() => navigate('/')}
            >
              На главную
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default FormPage;

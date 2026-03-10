import { Form, Input, Button, Card, message } from "antd";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {

  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {

    try {

      const res = await API.post("/auth/login", values);

      login(res.data);

      message.success("Login successful");

      navigate("/dashboard");

    } catch (error) {

      message.error("Invalid credentials");

    }

  };

  return (
    <Card title="CRM Login" style={{ width: 350, margin: "100px auto" }}>

      <Form layout="vertical" onFinish={onFinish}>

        <Form.Item label="Email" name="email" required>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" required>
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit" block>
          Login
        </Button>

      </Form>

    </Card>
  );
}

export default Login;
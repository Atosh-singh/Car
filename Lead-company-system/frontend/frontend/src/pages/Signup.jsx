import { Form, Input, Button, Card, message } from "antd";

import API from "../api/axios";

function Signup() {
  const onFinish = async (values) => {
    try {
      await API.post("/auth/signup", values);
      message.success("Account Created");
    } catch {
      message.error("Signup failed");
    }
  };

  return (
    <Card title="Signup" style={{ width: 350, margin: "100px auto" }}>
      <Form layout="vrtical" onFinish={onFinish}>
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
          <Form.Item name="email" label="Email">
          <Input />
        </Form.Item>
          <Form.Item name="password" label="Password">
          <Input />
        </Form.Item>

<Button type="primary" htmlType="submit" block>
    Signup
</Button>
      </Form>
    </Card>
  );
}


export default Signup;
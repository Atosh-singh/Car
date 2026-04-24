import { Form, Input, Button } from "antd";
import { useEffect } from "react";

function LeadForm({ initialValues, onSubmit, loading }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: initialValues?.name || "",
      phone: initialValues?.phone || "",
      email: initialValues?.email || "",
      interest: initialValues?.interest || "",
      source: initialValues?.source || "",
      locationData: initialValues?.locationData || ""
    });
  }, [initialValues, form]);

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
    >
      <Form.Item
        label="Lead Name"
        name="name"
        rules={[{ required: true, message: "Enter lead name" }]}
      >
        <Input placeholder="Enter lead name" />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[
          { required: true, message: "Enter phone number" },
          {
            pattern: /^\d{10}$/,
            message: "Phone number must be exactly 10 digits"
          }
        ]}
      >
        <Input placeholder="Enter 10 digit phone number" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: "email", message: "Enter valid email" }]}
      >
        <Input placeholder="Enter email" />
      </Form.Item>

      <Form.Item label="Interest" name="interest">
        <Input placeholder="Enter interest" />
      </Form.Item>

      <Form.Item label="Source" name="source">
        <Input placeholder="Enter source" />
      </Form.Item>

      <Form.Item label="Location" name="locationData">
        <Input placeholder="Enter location" />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block>
        {initialValues ? "Update Lead" : "Create Lead"}
      </Button>
    </Form>
  );
}

export default LeadForm;
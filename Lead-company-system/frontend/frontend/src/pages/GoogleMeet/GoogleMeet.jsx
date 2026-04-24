import React, { useState } from "react";
import { Button, Card, Input, Space, Typography, message } from "antd";
import { VideoCameraOutlined, LinkOutlined } from "@ant-design/icons";
import API from "../../api/axios";

const { Title, Text } = Typography;

const GoogleMeet = () => {
  const [meetLink, setMeetLink] = useState("");
  const [loading, setLoading] = useState(false);

  const connectGoogle = () => {
    window.open("http://localhost:5000/api/google/connect", "_self");
  };

  const createMeeting = async () => {
    try {
      setLoading(true);
      const res = await API.get("/google/create-meet");

      setMeetLink(res.data.meetLink);
      message.success("Meeting Created Successfully");

    } catch (err) {
      message.error(
        err.response?.data?.message || "Connect Google first"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>🎥 Google Meet Integration</Title>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>

        {/* CONNECT CARD */}
        <Card>
          <Space direction="vertical">
            <Text strong>Step 1: Connect your Google Account</Text>
            <Button
              type="primary"
              icon={<VideoCameraOutlined />}
              onClick={connectGoogle}
            >
              Connect Google
            </Button>
          </Space>
        </Card>

        {/* CREATE MEETING */}
        <Card>
          <Space direction="vertical">
            <Text strong>Step 2: Create Meeting</Text>
            <Button
              loading={loading}
              onClick={createMeeting}
            >
              Generate Meet Link
            </Button>
          </Space>
        </Card>

        {/* RESULT */}
        {meetLink && (
          <Card>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Text strong>Meeting Link</Text>

              <Input value={meetLink} readOnly />

              <Space>
                <Button
                  type="primary"
                  icon={<LinkOutlined />}
                  onClick={() => window.open(meetLink, "_blank")}
                >
                  Join Meeting
                </Button>

                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(meetLink);
                    message.success("Copied!");
                  }}
                >
                  Copy Link
                </Button>
              </Space>
            </Space>
          </Card>
        )}

      </Space>
    </div>
  );
};

export default GoogleMeet;
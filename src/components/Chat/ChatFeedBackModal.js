import { Button, Col, Form, Input, Row } from "antd";
import { FlexContainer } from "../UIComponents/UIComponents.style";
import {
  ConnectModalComponent,
  ModalContainer,
  ModalTitle,
  SubmitButton,
} from "./style";

const ChatFeedbackModal = ({
  open,
  onClose,
  submitMessageFeedback,
  message,
}) => {
  const [form] = Form.useForm();

  const handleSubmitMessageFeedbackRemark = (values) => {
    if (submitMessageFeedback)
      submitMessageFeedback(false, message, values?.remark);
    onClose();
  };

  return (
    // <Container>
    <ConnectModalComponent
      open={open}
      title={<ModalTitle>Provide feedback</ModalTitle>}
      width={700}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnClose={true}
      centered
      getContainer={() => document.getElementById("popoverchat-container")}
    >
      <ModalContainer>
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSubmitMessageFeedbackRemark}
          requiredMark={false}
        >
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <Form.Item
                name="remark"
                rules={[
                  {
                    required: true,
                    validator: (_, value) => {
                      if (value && value.trim() !== "") {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Feedback cannot be empty or whitespace"),
                      );
                    },
                    message: "Feedback cannot be empty or whitespace",
                  },
                ]}
              >
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  placeholder="Enter Feedback"
                />
              </Form.Item>
            </Col>
            <FlexContainer
              style={{ width: "100%", justifyContent: "space-between" }}
            >
              <Col>
                <Button
                  style={{ color: "#FF0000" }}
                  type="text"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Col>
              <Col>
                <SubmitButton type="primary" htmlType="submit">
                  Submit
                </SubmitButton>
              </Col>
            </FlexContainer>
          </Row>
        </Form>
      </ModalContainer>
    </ConnectModalComponent>
    // </Container>
  );
};

export default ChatFeedbackModal;

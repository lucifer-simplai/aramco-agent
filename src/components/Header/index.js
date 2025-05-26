import { Avatar, Flex, Image, Space, Tooltip } from "antd";
import React from "react";
import { useStore } from "zustand";
import { useAppStore } from "../../store";
import { CHATBOT_BASE_URL } from "../../utils/apiEndpoints";
import { ChatBotNameContainer, HeaderContainer } from "./style";

const Header = (props) => {
  const store = useStore(useAppStore, (state) => state);
  return (
    <HeaderContainer>
      <Flex
        gap={8}
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* <SimplaiIcon
        key="simplai-icon"
        height={30}
        width={25}
        alt=""
        onClick={() => {}}
      /> */}
        <Flex gap={8} align="center" justify="flex-start">
          {!!store?.userSessionConfig?.TENANT_ID ? (
            <Image
              src={`${CHATBOT_BASE_URL}/AramcoLogo.svg`}
              preview={false}
              style={{ maxHeight: 32 }}
            />
          ) : (
            <Avatar shape="square" />
          )}
        </Flex>
        <ChatBotNameContainer>
          {props?.chatConfig?.model ?? "Bot"}
        </ChatBotNameContainer>
        <Space>
          <Tooltip title="Minimise">
            {/* <MinusOutlined
              onClick={() => {
                if (props?.closePopover) {
                  props?.closePopover();
                }
              }}
              style={{ marginRight: 5 }}
            /> */}
          </Tooltip>
        </Space>
      </Flex>
    </HeaderContainer>
  );
};

export default Header;

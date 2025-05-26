import React from 'react'
import { FooterContainer } from './style'
import SimplaiIcon from '../Icons/SimplaiIcon'

const ChatFooter = () => {
  return (
    <FooterContainer>
      Powered by
      <SimplaiIcon
        height={15}
        width={15}
        alt=""
      />
      <span style={{color : 'rgba(96, 46, 223, 1)'}}>
        SimplAI
      </span>
    </FooterContainer>
  )
}

export default ChatFooter

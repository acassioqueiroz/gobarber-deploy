import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type Buttonrops = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<Buttonrops> = ({ children, ...rest }) => (
  <Container type="button" {...rest}>
    {children}
  </Container>
);

export default Button;

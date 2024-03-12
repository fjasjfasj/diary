import styled from 'styled-components';
import { Link } from 'wouter';

export const LinkSet = styled.ul`
  display: flex;
  gap: 0.5rem;
  flex-direction: ${(props) => props.$direction || 'row'};
`;

export default styled(Link)`
  color: var(--link-color);
  cursor: pointer;
  font-size: 1.1em;
  line-height: 1.5;
`;

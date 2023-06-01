import Link from "next/link";
import styled from 'styled-components';
import Center from "./Center";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/Bars";

const StyledHeader = styled.header`
  background-color: #222;
`;
const Logo = styled(Link)`
  color: #fff;
  text-decoration: none;
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px 0;
`;

const StyledNav = styled.nav`
  display: block;
  gap: 15px
`;

const NavLink = styled(Link)`
  color: #aaa;
  text-decoration: none;
`;

const NavButton = styled.button`
  background-color: transparent;
  width: 30px;
  heigth: 30px;
  border: 0;
  color: white;
  cursor: pointer;
`;

export default function Header() {
  const {cartProducts} = useContext(CartContext);
  return (
    <StyledHeader>
      <Center>
        <Wrapper>
          <Logo href={'/'}>eShop</Logo>
          <StyledNav>
            <NavLink href={'/'}>Home</NavLink>
            <NavLink href={'/products'}>All products</NavLink>
            <NavLink href={'/categories'}>Categories</NavLink>
            <NavLink href={'/account'}>Account</NavLink>
            <NavLink href={'/cart'}>Cart ({cartProducts.length})</NavLink>
          </StyledNav>
          <NavButton>
            <BarsIcon/>
          </NavButton>
        </Wrapper>
      </Center>
    </StyledHeader>
  )
}
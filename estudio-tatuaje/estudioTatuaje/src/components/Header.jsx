import { NavLink, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../context/useAuth.js'

const HeaderBar = styled.header`
  background: linear-gradient(180deg, rgba(245, 183, 0, 0.06), transparent);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`
const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  gap: 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
  }
`
const Title = styled.h1`
  margin: 0;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.green};
`
const Nav = styled.nav`
  ul {
    list-style: none;
    display: flex;
    gap: 0.4rem;
    margin: 0;
    padding: 0;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
`
const StyledLink = styled(NavLink)`
  color: ${({ theme }) => theme.colors.muted};
  text-decoration: none;
  padding: 0.35rem 0.5rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 0.95rem;

  &:hover {
    background: rgba(245, 183, 0, 0.06);
    color: ${({ theme }) => theme.colors.green};
  }
  &.active {
    background: rgba(47, 107, 47, 0.06);
    color: ${({ theme }) => theme.colors.green};
    font-weight: 600;
  }
`
const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.muted};
  padding: 0.35rem 0.6rem;
  font-size: 0.85rem;
  box-shadow: none;

  &:hover {
    color: ${({ theme }) => theme.colors.danger};
    border-color: ${({ theme }) => theme.colors.danger};
    transform: none;
    filter: none;
  }
`
const UserBadge = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.green};
  background: ${({ theme }) => theme.colors.successBg};
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
`

export default function Header() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <HeaderBar>
      <Inner className="container">
        <Title>Estudio Girasol</Title>
        <Nav>
          <ul>
            <li><StyledLink to="/">Home</StyledLink></li>
            <li><StyledLink to="/about">About</StyledLink></li>
            <li><StyledLink to="/citas">Citas</StyledLink></li>
            <li><StyledLink to="/contact">Contact</StyledLink></li>
            {isAdmin && <li><StyledLink to="/admin">Admin</StyledLink></li>}
            {user ? (
              <>
                <li>
                  <UserBadge>
                    {user.name} · {user.role}
                  </UserBadge>
                </li>
                <li>
                  <LogoutButton onClick={handleLogout}>Salir</LogoutButton>
                </li>
              </>
            ) : (
              <li><StyledLink to="/login">Entrar</StyledLink></li>
            )}
          </ul>
        </Nav>
      </Inner>
    </HeaderBar>
  )
}

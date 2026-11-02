import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'

import { useAuth } from '../context/useAuth.js'
import {
  Page,
  PageTitle,
  PageIntro,
  Form,
  Field,
  Input,
  FormError,
  FullButton,
  FieldError,
} from '../styles/formComponents.js'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

const Hint = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;

  a {
    color: ${({ theme }) => theme.colors.green};
    font-weight: 600;
  }
`

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  async function onSubmit(values) {
    setServerError(null)
    try {
      const user = await login(values.email, values.password)
      navigate(user.role === 'admin' ? '/admin' : '/citas')
    } catch (err) {
      setServerError(err.message)
    }
  }

  return (
    <Page as={motion.section}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <PageTitle>Iniciar sesión</PageTitle>
      <PageIntro>Accede para gestionar tus citas o el panel del estudio.</PageIntro>

      <Form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field $full>
          Email
          <Input
            type="email"
            placeholder="tu@email.com"
            $invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
        </Field>

        <Field $full>
          Contraseña
          <Input
            type="password"
            placeholder="••••••••"
            $invalid={!!errors.password}
            {...register('password')}
          />
          {errors.password && <FieldError>{errors.password.message}</FieldError>}
        </Field>

        {serverError && <FormError>{serverError}</FormError>}

        <FullButton type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </FullButton>
      </Form>

      <Hint>
        ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
      </Hint>
      <Hint>
        Demo admin: admin@estudio.com / admin123 · cliente: cliente@estudio.com / cliente123
      </Hint>
    </Page>
  )
}

import { Box, Button, Stack, Typography } from '@mui/joy'
import styles from '@/components/navbar/navbar.module.scss'

export default function Navbar() {
  return (
    <Box className={styles.navbar} sx={{ boxShadow: 'md' }}>
      <Typography fontSize={24} fontWeight={600} color="primary">
        Quiziset
      </Typography>

      <Stack direction="row" spacing={1}>
        <Button variant="outlined">Login</Button>
        <Button variant="solid">Sign Up</Button>
      </Stack>
    </Box>
  )
}

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    // Attempt to connect and perform a simple query
    const result = await prisma.$queryRaw`SELECT 1`
    console.log('Database connection successful!')
    console.log('Query result:', result)
  } catch (error) {
    console.error('Failed to connect to the database:')
    console.error(error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 
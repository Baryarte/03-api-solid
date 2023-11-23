import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
        })

        return checkIn
    }

    async save(data: CheckIn) {
        const checkIn = await prisma.checkIn.update({
            where: {
                id: data.id,
            },
            data,
        })

        return checkIn
    }

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date')
        const endOfTheDay = dayjs(date).endOf('date')

        const checkIn = await prisma.checkIn.findFirst({
            // findFirst porque o campo no where não é único
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay.toDate(),
                    lte: endOfTheDay.toDate(),
                },
            },
        })

        return checkIn
    }

    async findManyByUserId(
        userId: string,
        page: number
    ): Promise<
    {
      id: string;
      created_at: Date;
      validated_at: Date | null;
      user_id: string;
      gym_id: string;
    }[]
  > {
        const checkIns = await prisma.checkIn.findMany({
            where: {
                user_id: userId,
            },
            take: 20,
            skip: (page - 1) * 20,
        })

        return checkIns
    }

    async findById(
        id: string
    ): Promise<{
    id: string;
    created_at: Date;
    validated_at: Date | null;
    user_id: string;
    gym_id: string;
  } | null> {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id,
            },
        })

        return checkIn
    }

    async countByUserId(userId: string): Promise<number> {
        const count = await prisma.checkIn.count({
            where: {
                user_id: userId,
            },
        })

        return count
    }
}

import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from '../gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { randomUUID } from 'crypto'
import { getDistanceBetweenCoordinates } from '@/use-cases/utils/get-distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = []

    async findManyNearby(params: FindManyNearbyParams) {
        const nearbyGyms = this.items.filter((item) => {
            const distance = getDistanceBetweenCoordinates(
                {
                    latitude: params.latitude,
                    longitude: params.longitude,
                },
                {
                    latitude: item.latitude.toNumber(),
                    longitude: item.longitude.toNumber(),
                }
            )
            console.log(distance)
            return distance < 10
        })

        return nearbyGyms
    }

    async searchMany(query: string, page: number) {
        return this.items
            .filter((item) => item.title.includes(query))
            .slice((page - 1) * 20, page * 20)
    }

    async create(data: Prisma.GymCreateInput) {
        const gym: Gym = {
            id: data.id ? data.id : randomUUID(),
            title: data.title,
            description: data.description ? data.description : null,
            phone: data.phone ? data.phone : null,
            latitude: new Decimal(data.latitude.toString()),
            longitude: new Decimal(data.longitude.toString()),
        }

        this.items.push(gym)

        return gym
    }

    async findById(id: string) {
        const gym = this.items.find((item) => item.id === id)

        if (!gym) {
            return null
        }

        return gym
    }
}

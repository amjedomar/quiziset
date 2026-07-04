import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { PrismaErrorCode, PrismaService } from '@/prisma-service'
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto'
import { UserEntity } from '@/modules/user/entities/user.entity'
import { omitUndefinedAttrs } from '@/utils/omit-undefined-attrs'
import { deleteUploadedFileByUrl } from '@/utils/uploads-management'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

export const UserErrors = {
  NOT_FOUND: 'user not found',
  EMAIL_ALREADY_EXISTS: 'a user with the same email already exists',
}

const omitSensitiveData = {
  password: true as const,
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: number): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, omit: omitSensitiveData })

    if (!user) {
      throw new NotFoundException(UserErrors.NOT_FOUND)
    }

    return user
  }

  async updateMe(userId: number, dto: UpdateUserDto): Promise<UserEntity> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new NotFoundException(UserErrors.NOT_FOUND)
    }

    /**
     * if the profile image has been replaced/removed then delete
     * the previous image file from the server
     *
     * btw please keep in mind that `deleteUploadedFileByUrl` skips /public paths
     * (so default images are kept)
     */
    if (dto.imageUrl !== undefined && dto.imageUrl !== user.imageUrl) {
      await deleteUploadedFileByUrl(user.imageUrl)
    }

    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: omitUndefinedAttrs(dto),
        omit: omitSensitiveData,
      })
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === PrismaErrorCode.UniqueConstraintViolation) {
        throw new BadRequestException(UserErrors.EMAIL_ALREADY_EXISTS)
      }

      throw new InternalServerErrorException()
    }
  }
}

import {
  AlreadyExistsError,
  InvalidDataError,
  NotFoundError,
  UnexpectedBehaviorDetectedError,
} from '@/layers/entity/errors'
import { Result } from '@/lib/utils/Result'

export interface TagUseCase {
  createTag(
    _tag: string,
  ): Promise<Result<true, AlreadyExistsError | InvalidDataError | Error>>
  deleteTag(
    _tag: string,
  ): Promise<
    Result<true, NotFoundError | UnexpectedBehaviorDetectedError | Error>
  >

  listTags(): Promise<Result<string[], Error>>
}

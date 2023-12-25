import { Result } from '@/lib/utils/Result'
import {
  TagAlreadyExistsError,
  TagExcessiveScopeError,
  TagInvalidDataError,
  TagNotFoundError,
} from './errors'

export interface TagUseCase {
  createTag(
    _tag: string,
  ): Promise<Result<true, TagAlreadyExistsError | TagInvalidDataError | Error>>
  deleteTag(
    _tag: string,
  ): Promise<Result<true, TagNotFoundError | TagExcessiveScopeError | Error>>

  listTags(): Promise<Result<string[], Error>>
}

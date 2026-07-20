import { AppException, GLOBAL_ERRORS } from '@@exceptions';
import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: string): number {
    const parsedInt = Number.parseInt(value, 10);

    if (Number.isNaN(parsedInt) || parsedInt < 0) {
      throw new AppException(GLOBAL_ERRORS.INVALID_POSITIVE_INT);
    }

    return parsedInt;
  }
}

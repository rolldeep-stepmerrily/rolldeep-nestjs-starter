import { Injectable, PipeTransform } from '@nestjs/common';

import { AppException, GLOBAL_ERRORS } from '@@exceptions';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: string) {
    const parsedInt = parseInt(value, 10);

    if (isNaN(parsedInt) || parsedInt < 0) {
      throw new AppException(GLOBAL_ERRORS.INVALID_POSITIVE_INT);
    }

    return parsedInt;
  }
}

import { Injectable, PipeTransform } from '@nestjs/common';

import { CustomHttpException, GLOBAL_ERRORS } from '@@exceptions';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: string) {
    const parsedInt = parseInt(value, 10);

    if (isNaN(parsedInt) || parsedInt < 0) {
      throw new CustomHttpException(GLOBAL_ERRORS.INVALID_POSITIVE_INT);
    }

    return parsedInt;
  }
}

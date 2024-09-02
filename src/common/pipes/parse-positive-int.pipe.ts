import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform {
  transform(value: string) {
    const parsedInt = parseInt(value, 10);

    if (isNaN(parsedInt) || parsedInt < 0) {
      throw new BadRequestException();
    }

    return parsedInt;
  }
}

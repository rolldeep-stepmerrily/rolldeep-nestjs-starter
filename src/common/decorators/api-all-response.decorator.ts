import { GLOBAL_ERRORS } from '@@exceptions';
import { EmptySuccessResponse, ExceptionResponse, TypedSuccessResponse } from '@@types';
import { applyDecorators, HttpStatus, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse, getSchemaPath } from '@nestjs/swagger';
import { isDefined } from 'class-validator';

interface AppExceptionDefinition {
  statusCode: HttpStatus;
  errorCode: string;
  message: string;
}

interface ApiAllResponseOptions {
  name: string;
  description: string;
  status?: HttpStatus;
  responseDataDto?: Type<unknown> | [Type<unknown>];
  responseMetaDto?: Type<unknown>;
  exceptions?: AppExceptionDefinition[];
}

/**
 * 예외 목록을 상태 코드 기준으로 그룹화
 *
 * @param {AppExceptionDefinition[]} exceptions 그룹화할 예외 정의 목록
 * @returns {Map<HttpStatus, AppExceptionDefinition[]>} 상태 코드별로 그룹화된 예외 정의
 */
const groupExceptionsByStatusCode = (
  exceptions: AppExceptionDefinition[],
): Map<HttpStatus, AppExceptionDefinition[]> => {
  const grouped = new Map<HttpStatus, AppExceptionDefinition[]>();

  exceptions.forEach((exception) => {
    const group = grouped.get(exception.statusCode) ?? [];
    group.push(exception);
    grouped.set(exception.statusCode, group);
  });

  return grouped;
};

/**
 * 엔드포인트의 성공/실패 응답을 한번에 문서화하는 Swagger 데코레이터
 *
 * ValidationPipe에 의한 400 검증 실패(GLOBAL_ERRORS.VALIDATION_ERROR)는 모든 엔드포인트에 공통으로 발생할 수 있어 자동으로 포함
 *
 * @param {ApiAllResponseOptions} options 엔드포인트 이름, 설명, 응답/예외 DTO 정보
 * @returns {ReturnType<typeof applyDecorators>} 적용할 데코레이터 묶음
 */
export const ApiAllResponse = ({
  name,
  description,
  status = HttpStatus.OK,
  responseDataDto,
  responseMetaDto,
  exceptions,
}: ApiAllResponseOptions): ReturnType<typeof applyDecorators> => {
  const apiOperation = ApiOperation({
    operationId: name,
    summary: `${description} API`,
  });

  const hasTypedData = isDefined(responseDataDto) || isDefined(responseMetaDto);

  const apiResponseType = hasTypedData
    ? TypedSuccessResponse({
        name: `${name}Response`,
        data: isDefined(responseDataDto)
          ? Array.isArray(responseDataDto)
            ? { type: responseDataDto[0], isArray: true }
            : { type: responseDataDto }
          : undefined,
        meta: isDefined(responseMetaDto) ? { type: responseMetaDto } : undefined,
      })
    : EmptySuccessResponse;

  const apiSuccessResponse = ApiResponse({
    status,
    description: `${description} 성공`,
    type: apiResponseType,
  });

  const allExceptions = [GLOBAL_ERRORS.VALIDATION_ERROR, ...(exceptions ?? [])];

  const apiExceptionResponses = applyDecorators(
    ApiExtraModels(ExceptionResponse),
    ...Array.from(groupExceptionsByStatusCode(allExceptions).entries()).map(([statusCode, group]) =>
      ApiResponse({
        status: statusCode,
        description: `${description} 실패 (${group.map((exception) => exception.errorCode).join(', ')})`,
        schema: {
          allOf: [
            { $ref: getSchemaPath(ExceptionResponse) },
            {
              properties: {
                errorCode: { type: 'string', enum: group.map((exception) => exception.errorCode) },
                message: { type: 'string', enum: group.map((exception) => exception.message) },
              },
            },
          ],
        },
      }),
    ),
  );

  return applyDecorators(apiOperation, apiSuccessResponse, apiExceptionResponses);
};

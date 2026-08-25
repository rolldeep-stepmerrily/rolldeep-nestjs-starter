/**
 * 공통 성공 응답 포맷
 *
 * data는 항상 채워야 하는 필수 필드이며, 데이터가 없는 응답은 EmptySuccessResponse를 사용
 */
export class SuccessResponse<T = null, F = null> {
  data!: T;
  meta?: F;
}
